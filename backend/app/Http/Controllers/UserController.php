<?php

namespace App\Http\Controllers;

use App\Models\Sex;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
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

    public function index()
    {
        $users = User::all();

        foreach($users as $i => $user) {
            $sex = Sex::where('id', '=', $user->sex_id)->first();
            $users[$i]->sex_id = $sex;
        }

        return response()->json($users);
    }

    public function create(Request $request)
    {
        $this->validate($this->request, [
            'email' => 'required|email',
            'password' => 'required',
            'name' => 'required',
            'lastname' => 'required',
            'sex_id' => 'required|numeric'
        ]);

        $sex = Sex::find($request->sex_id);
        if(!$sex) {
            return response()->json([
                'error' => 'Sex does not exist.'
            ], 404);
        }

        try {
            $user = new User;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->name = $request->name;
            $user->second_name = $request->second_name;
            $user->lastname = $request->lastname;
            $user->phone = $request->phone;
            $user->facebook = $request->facebook;
            $user->hobby = $request->hobby;
            $user->description = $request->description;
            $user->sex_id = $request->sex_id;

            $user->save();

            return response()->json([
                'success' => 'User created successfully',
                'user' => $user
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $user = User::find($id);
        if(!$user) {
            return response()->json([
                'error' => 'User does not exist.'
            ], 404);
        }

        $sex = Sex::where('id', '=', $user->sex_id)->first();
        $user->sex_id = $sex;

        return response()->json($user);
    }

    /**
     * Authenticate a user and return the token if the provided credentials are correct.
     *
     * @param  User $user
     * @return mixed
     */
    public function me()
    {
        $sex = Sex::where('id', '=', $this->request->auth->sex_id)->first();
        $this->request->auth->sex_id = $sex;
        return response()->json($this->request->auth, 200);
    }


    public function sex_list()
    {
        $sex = Sex::all();
        return response()->json($sex);
    }
}
