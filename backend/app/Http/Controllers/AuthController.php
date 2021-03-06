<?php

namespace App\Http\Controllers;

use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
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

    /**
     * Create a new token.
     * @param  User $user
     * @return string
     */
    protected function jwt(User $user)
    {
        $payload = [
            'iss' => "teach-air", // Issuer of the token
            'sub_id' => $user->id, // Subject of the token
            'iat' => time(), // Time when JWT was issued.
            // 'exp' => time() + 60 * 60 // Expiration time TODO na produkcji
            'exp' => time() + 60 * 60 * 10000
        ];

        // As you can see we are passing `JWT_SECRET` as the second parameter that will
        // be used to decode the token in the future.
        return JWT::encode($payload, env('JWT_SECRET'));
    }

    /**
     * Authenticate a user and return the token if the provided credentials are correct.
     * @param User $user
     * @return mixed
     * @throws ValidationException
     */
    public function verify(User $user)
    {
        $this->validate($this->request, [
            'email' => 'required|email',
            'password' => 'required'
        ]);
        // Find the user by email
        $user = User::where('email', $this->request->input('email'))->first();
        if (!$user) {
            return response()->json([
                'error' => 'Taki email nie istnieje'
            ], 400);
        }
        // Verify the password and generate the token
        if (Hash::check($this->request->input('password'), $user->password)) {
            if($user->status == 0) {
                return response()->json([
                    'error' => 'Konto nie zostalo jeszcze aktywowane. Sprawdz maila',
                ], 400);
            }


            return response()->json([
                'token' => $this->jwt($user)
            ], 200);
        }
        // Bad Request response
        return response()->json([
            'error' => 'Email lub haslo jest nieprawidlowe',
        ], 400);
    }
}
