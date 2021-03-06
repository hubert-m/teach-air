<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Message_file;
use App\Models\Option;
use App\Models\Post_file;
use Illuminate\Http\Request;

class FileController extends Controller
{
    /**
     * The request instance.
     * @var Request
     */
    private $request;

    /**
     * Create a new controller instance.
     * @param Request $request
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function upload(Request $request)
    {
        if ($request->hasFile('file')) {
            $settings_file_extensions = explode(',', Option::where('option_name', '=', 'file_extensions')->first()->option_value);
            $settings_max_file_size = intval(Option::where('option_name', '=', 'max_file_size')->first()->option_value) * 1024; // zamieniamy na int i * 1024 zeby miec Bajty zamiast kilobajtow
            $original_filename = $request->file('file')->getClientOriginalName();
            $original_filename_without_ex = $request->fileName ?: pathinfo($original_filename, PATHINFO_FILENAME);
            $size = $request->file('file')->getSize();
            $original_filename_arr = explode('.', $original_filename);
            $file_ext = end($original_filename_arr);
            $destination_path = './upload/' . $request->auth->id . "/";
            // $new_name = 'U-' . time() . '.' . $file_ext;

            $allow_extension = false;

            foreach ($settings_file_extensions as $extension) {
                if ($extension == $file_ext) {
                    $allow_extension = true;
                }
            }

            if (!$allow_extension) {
                return $this->responseRequestError('Rozszerzenie ' . $file_ext . ' nie jest dozwolone', 400);
            }

            if ($settings_max_file_size < $size) {
                return $this->responseRequestError('Plik jest zbyt duzy. Maksymalna waga to ' . $settings_max_file_size . 'B = '
                    . ($settings_max_file_size / 1024) . 'KB = '
                    . ($settings_max_file_size / 1024 / 1024) . 'MB = ', 400);
            }

            $i = 0;
            $isExist = File::where('name', '=', $original_filename_without_ex)->where('created_by', '=', $request->auth->id)->first();
            while ($isExist) {
                $i++;
                $original_filename_without_ex_tmp = $original_filename_without_ex . "-" . $i;
                $isExist = File::where('name', '=', $original_filename_without_ex_tmp)->where('created_by', '=', $request->auth->id)->first();
            }

            if ($i > 0) {
                $original_filename_without_ex .= "-" . $i;
            }

            $new_name = $original_filename_without_ex . '.' . $file_ext;

            if ($request->file('file')->move($destination_path, $new_name)) {
                try {
                    $file = new File();
                    $file->name = $original_filename_without_ex;
                    $file->url = $request->getSchemeAndHttpHost() . "/upload/" . $request->auth->id . "/" . $new_name;
                    $file->extension = $file_ext;
                    $file->size = $size;
                    $file->created_by = $request->auth->id;
                    $file->save();
                } catch (\Throwable $e) {
                    return $this->responseRequestError($e->getMessage(), 500);
                }
                return $this->responseRequestSuccess($file);
            } else {
                return $this->responseRequestError('Nie udalo sie wgrac pliku', 400);
            }
        } else {
            return $this->responseRequestError('Nie znaleziono pliku', 400);
        }
    }

    public function delete_file($id)
    {
        $file = File::find($id);

        if (!$file) {
            return response()->json([
                'error' => 'Plik nie istnieje'
            ], 400);
        }

        if ($this->request->auth->id != $file->created_by) {
            return response()->json([
                'error' => 'Nie mozesz usunac czyjegos pliku'
            ], 400);
        }

        $countMessages = count(Message_file::where('file_id', '=', $file->id)->get());
        $countPosts = count(Post_file::where('file_id', '=', $file->id)->get());

        if ($countMessages > 0 || $countMessages > 0) {
            return response()->json([
                'error' => 'Nie mozesz usunac pliku - zostal uzyty w przynajmniej jednej wiadomosci lub poscie'
            ], 400);
        }

        try {
            $file->delete();

            return response()->json([
                'success' => 'Plik usuniety pomyslnie',
                'file' => $file
            ], 202);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function search()
    {
        $keyword = $this->request->input('keyword', '');
        $extensions = $this->request->input('extensions', ''); // rozszerzenia oddzielane przecinkiem

        $files = File::where('created_by', '=', $this->request->auth->id)
            ->where(function ($query) use ($keyword) {
                $keywords = explode(" ", $keyword);
                foreach ($keywords as $word) {
                    $word = strtolower($word);
                    $query->whereRaw("LOWER(CONCAT(COALESCE(`name`,''), COALESCE(`extension`,''))) LIKE ?", "%$word%");
                }
            })
            ->where(function ($query) use ($extensions) {
                if ($extensions != "") {
                    $extensions = explode(",", $extensions);
                    foreach ($extensions as $extension) {
                        $query->orWhere('extension', '=', $extension);
                    }
                }
            })
            ->get();

        foreach ($files as $i => $file) {
            $countMessages = count(Message_file::where('file_id', '=', $file->id)->get());
            $files[$i]->usedInMessages = $countMessages;

            $countPosts = count(Post_file::where('file_id', '=', $file->id)->get());
            $files[$i]->usedInPosts = $countPosts;
        }
        return response()->json($files);

    }

    protected function responseRequestSuccess($ret)
    {
        return response()->json(['status' => 'success', 'data' => $ret], 200)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    protected function responseRequestError($message = 'Bad request', $statusCode = 200)
    {
        return response()->json(['status' => 'error', 'error' => $message], $statusCode)
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }
}
