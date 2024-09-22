<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use GuzzleHttp\Psr7\Request;
use Laravel\Passport\TokenRepository;
use Laravel\Passport\Passport;

class VerifyToken extends Controller
{
    protected $tokenRepository;

    public function __construct(TokenRepository $tokenRepository)
    {
        $this->tokenRepository = $tokenRepository;
    }

    public function verifyToken(Request $request)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token not provided'], 401);
        }

        $accessToken = $this->tokenRepository->find($token);

        if (!$accessToken) {
            return response()->json(['message' => 'Token is invalid'], 401);
        }

        // Get the user associated with the token
        $user = $accessToken->user;

        return response()->json($user);
    }
}
