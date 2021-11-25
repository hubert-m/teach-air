<?php

namespace App\Http\Controllers;

use App\Models\Message;
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
                'error' => 'You cannot send message to yourself'
            ], 404);
        }

        $user = User::find($request->recipient_id);
        if (!$user) {
            return response()->json([
                'error' => 'User does not exist.'
            ], 404);
        }

        try {
            $message = new Message;
            $message->sender_id = $this->request->auth->id;
            $message->recipient_id = intval($request->recipient_id);
            $message->content = $request->message;

            $message->save();

            return response()->json([
                'success' => 'Message send successfully',
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
                'error' => 'User does not exist.'
            ], 404);
        }

        if ($this->request->auth->id == $id) {
            return response()->json([
                'error' => 'You cannot get messages with yourself'
            ], 404);
        }


        $messages = Message::where(function ($query) use ($id) {
            $query->where('sender_id', '=', $this->request->auth->id)->where('recipient_id', '=', $id);
        })->orWhere(function ($query) use ($id) {
                $query->where('sender_id', '=', $id)->where('recipient_id', '=', $this->request->auth->id);
            })->get();

        return response()->json($messages);
    }

    public function get_contact_list() {

        $arr_id_users = array();

        $messages = Message::where('sender_id', '=', $this->request->auth->id)
            ->orWhere('recipient_id', '=', $this->request->auth->id)->get();

        foreach ($messages as $message) {
            if($message->sender_id == $this->request->auth->id) {
                array_push($arr_id_users, $message->recipient_id);
            } else if($message->recipient_id == $this->request->auth->id) {
                array_push($arr_id_users, $message->sender_id);
            }
        }

        $arr_id_users = array_unique($arr_id_users);

        if(count($arr_id_users) > 0) {
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
