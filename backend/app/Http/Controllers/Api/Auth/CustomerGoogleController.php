<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\Image;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class CustomerGoogleController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        // $googleUser = Socialite::driver('google')->stateless()->user();
        // if ($googleUser) {
        //     return response()->json(['success' => 'tes']);
        // }

        return Socialite::driver('google')->with(["prompt" => "select_account"])->redirect();
        // return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            // $userEmail = Socialite::driver('google')->stateless()->user();

            $googleUser = Socialite::driver('google')->stateless()->user();
            $existingUser = User::where('email', $googleUser->email)->whereNotNull('gauth_id')->first();
            $nativeUser = User::where('email', $googleUser->email)->whereNull('gauth_id')->first();


            if ($nativeUser) {
                return response()->json([
                    'status' => 400,
                    'message' => 'A user with this email already exists. Please log in using your existing account.',
                ], 400);
            }

            if ($existingUser) {
                $data = [
                    'grant_type' => 'password',
                    'client_id' => config('app.passport_client_id'),
                    'client_secret' => config('app.passport_client_secret'),
                    'username' => $existingUser->email,
                    'password' => 'password' . $googleUser->id,
                    'scope' => '*',
                ];

                $oauthRequest = app('request')->create('/oauth/token', 'POST', $data);
                $oauthResponse = app()->handle($oauthRequest);


                $responseData = json_decode($oauthResponse->getContent(), true);

                // $cookie = cookie('token', $responseData['access_token'], 60 * 24, '/', '.localhost:3000', true, true, false, 'Strict');

                // return redirect('http://localhost:3000?token=' . $responseData['access_token'])
                return redirect()->away('http://localhost:3000?token=' . $responseData['access_token'] . '&code=' . $existingUser->uuid);
                // return [
                //     'token_type' => $responseData['token_type'],
                //     'expires_in' => $responseData['expires_in'],
                //     'access_token' => $responseData['access_token'],
                //     'refresh_token' => $responseData['refresh_token'],
                //     'user' => $existingUser,
                // ];
            } else {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'gauth_id' => $googleUser->id,
                    'status' => 'active',
                    'password' => bcrypt('password' . $googleUser->id),
                ]);
                $user->assignRole('customer');
                $imageModel = new Image();
                $imageModel->url = $googleUser->avatar;
                $imageModel->alt_text = 'google_profile';
                $user->images()->save($imageModel);
                $user->markEmailAsVerified();
                $data = [
                    'grant_type' => 'password',
                    'client_id' => config('app.passport_client_id'),
                    'client_secret' => config('app.passport_client_secret'),
                    'username' => $user->email,
                    'password' => 'password' . $googleUser->id,
                    'scope' => '*',
                ];

                $oauthRequest = app('request')->create('/oauth/token', 'POST', $data);
                $oauthResponse = app()->handle($oauthRequest);


                $responseData = json_decode($oauthResponse->getContent(), true);

                return redirect()->away('http://localhost:3000?token=' . $responseData['access_token'] . '&code=' . $user->uuid);
            }
        } catch (\Exception $e) {
            dd($e->getMessage());
            return Socialite::driver('google')->with(["prompt" => "select_account"])->redirect();
        }
    }

    public function chooseAccount()
    {
        return Socialite::driver('google')->with(["prompt" => "select_account"])->redirect();
    }
}
