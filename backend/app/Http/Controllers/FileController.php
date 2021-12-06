<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Message_file;
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

    public function upload(Request $request) {
        if ($request->hasFile('file')) {
            $original_filename = $request->file('file')->getClientOriginalName();
            $original_filename_without_ex = $request->fileName ?: pathinfo($original_filename, PATHINFO_FILENAME);
            $size = $request->file('file')->getSize();
            $original_filename_arr = explode('.', $original_filename);
            $file_ext = end($original_filename_arr);
            $destination_path = './upload/'.$request->auth->id."/";
            // $new_name = 'U-' . time() . '.' . $file_ext;

            $i = 0;
            $isExist = File::where('name', '=', $original_filename_without_ex)->where('created_by', '=', $request->auth->id)->first();
            while($isExist) {
                $i++;
                $original_filename_without_ex_tmp = $original_filename_without_ex . "-" . $i;
                $isExist = File::where('name', '=', $original_filename_without_ex_tmp)->where('created_by', '=', $request->auth->id)->first();
            }

            if($i>0) {
                $original_filename_without_ex .= "-" . $i;
            }

            $new_name = $original_filename_without_ex . '.' . $file_ext;

            if ($request->file('file')->move($destination_path, $new_name)) {
                try {
                    $file = new File();
                    $file->name = $original_filename_without_ex;
                    $file->url = $request->getSchemeAndHttpHost()."/upload/".$request->auth->id."/".$new_name;
                    $file->extension = $file_ext;
                    $file->size = $size;
                    $file->created_by = $request->auth->id;
                    $file->save();
                } catch (\Throwable $e) {
                    return $this->responseRequestError($e->getMessage(), 500);
                }
                return $this->responseRequestSuccess($file);
            } else {
                return $this->responseRequestError('Cannot upload file', 400);
            }
        } else {
            return $this->responseRequestError('File not found', 400);
        }
    }

    public function get_files() {
        $files = File::where('created_by', '=', $this->request->auth->sex_id)->get();
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
