<?php

namespace App\Http\Middleware;

use App\Models\Sex;
use Closure;
use Exception;
use App\Models\User;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;

class JwtMiddleware
{
    /**
     * Handle all requests validating Jwt token and finding user
     * @param $request
     * @param Closure $next
     * @param null $guard
     * @return mixed
     */
    public function handle($request, Closure $next, $guard = null)
    {
        $token = $request->header('token');

        // Have a token on that request?
        if (!$token) {
            return response()->json(['error' => 'You must send user Token'], 401);
        }

        // Try decode token to retrieve credential payload
        try {
            $credentials = JWT::decode($token, env('JWT_SECRET'), ['HS256']);
        } catch (ExpiredException $e) {
            return response()->json(['error' => 'Provided token is expired.'], 400);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error while decoding token.'], 400);
        }

        // Find token user
        $user = User::find($credentials->sub_id);

        // podmiana 'sex_id' na obiekt zawierający id płci oraz value - nazwe [1 - Mężczyzna ; 2 - Kobieta ... ]
        // $user = (object) array_merge((array) json_decode($user), ['sex_id' => Sex::find($user->sex_id)]);

        // Decore request with user
        $request->auth = $user;

        return $next($request);
    }
}
