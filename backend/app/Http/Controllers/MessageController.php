<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Message;
use App\Models\Message_file;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
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

    public function send_message(Request $request)
    {
        $this->validate($this->request, [
            'message' => 'required',
            'recipient_id' => 'required|numeric'
        ]);

        if ($this->request->auth->id == $request->recipient_id) {
            return response()->json([
                'error' => 'Nie mozesz wyslac wiadomosci do siebie'
            ], 400);
        }

        $user = User::find($request->recipient_id);
        if (!$user) {
            return response()->json([
                'error' => 'Uzytkownik nie istnieje'
            ], 400);
        }

        try {
            $message = new Message;
            $message->sender_id = $this->request->auth->id;
            $message->recipient_id = intval($request->recipient_id);
            $message->content = $request->message;
            $message->save();


            $files = $request->post("files");

            foreach ($files as $file) {
                try {
                    $fileMessage = new Message_file;
                    $fileMessage->message_id = $message->id;
                    $fileMessage->file_id = $file["id"];
                    $fileMessage->save();

                } catch (\Throwable $e) {
                    return response()->json([
                        'error' => $e->getMessage()
                    ], 500);
                }
            }

            return response()->json([
                'success' => 'Wiadomosc wyslana pomyslnie',
                'message' => $message
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function get_messages($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'error' => 'Uzytkownik nie istnieje'
            ], 400);
        }

        if ($this->request->auth->id == $id) {
            return response()->json([
                'error' => 'Nie mozesz pobrac wiadomosci z soba'
            ], 400);
        }


        $messages = Message::where(function ($query) use ($id) {
            $query->where('sender_id', '=', $this->request->auth->id)->where('recipient_id', '=', $id);
        })->orWhere(function ($query) use ($id) {
            $query->where('sender_id', '=', $id)->where('recipient_id', '=', $this->request->auth->id);
        })->get();

        foreach ($messages as $i => $message) {
            if ($message->is_read == 0 && $message->recipient_id == $this->request->auth->id) {
                try {
                    $message->is_read = 1;
                    $message->save();
                } catch (\Throwable $e) {
                }
            }

            $filesMessage = Message_file::where('message_id', '=', $message->id)->get();
            if(count($filesMessage) > 0) {
                $files = File::where(function ($query) use ($filesMessage) {
                    foreach ($filesMessage as $idFile) {
                        $query->orWhere('id', '=', $idFile->file_id);
                    }
                })->get();
            } else {
                $files = array();
            }

            $messages[$i]->files = $files;
        }

        return response()->json($messages);
    }

    public function get_contact_list()
    {

        $arr_id_users = array();

        $messages = Message::where('sender_id', '=', $this->request->auth->id)
            ->orWhere('recipient_id', '=', $this->request->auth->id)->get();

        foreach ($messages as $message) {
            if ($message->sender_id == $this->request->auth->id) {
                array_push($arr_id_users, $message->recipient_id);
            } else if ($message->recipient_id == $this->request->auth->id) {
                array_push($arr_id_users, $message->sender_id);
            }
        }

        $arr_id_users = array_unique($arr_id_users);

        if (count($arr_id_users) > 0) {
            $users = User::where(function ($query) use ($arr_id_users) {
                foreach ($arr_id_users as $user_id) {
                    $query->orWhere('id', '=', $user_id);
                }
            })->get();
        } else {
            $users = array();
        }

        // decore contact with last message between them
        foreach ($users as $i => $user) {
            $id = $user->id;
            $last_message = Message::where(function ($query) use ($id) {
                $query->where('sender_id', '=', $this->request->auth->id)->where('recipient_id', '=', $id);
            })->orWhere(function ($query) use ($id) {
                $query->where('sender_id', '=', $id)->where('recipient_id', '=', $this->request->auth->id);
            })->latest()->first();

            $users[$i]->lastMessage = $last_message;
        }

        return response()->json($users);
    }


}
