<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Http;
use Laravel\Passport\Client;

class MerchantAuthController extends ApiController
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'forgot_password', 'reset_password', 'refresh']]);
    }

    protected function validator(array $data)
    {
        Log::info('Validator method called');
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            // 'phone_number' => ['required', 'string', 'regex:/^[0-9]{10,15}$/', 'unique:users'],
            'phone_number' => 'required|string|unique:users,phone_number',
            'address',
        ]);
    }

    protected function create(array $data)
    {
        Log::info('Create method called');
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            // 'role' => $data['role'],
            'role' => 'merchant',
            'phone_number' => $data['phone_number'] ?? null,
            'address' => $data['address'] ?? null,
        ]);
    }


    public function register(Request $request)
    {
        try {
            DB::beginTransaction();
            $this->validator($request->all())->validate();
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error: ', $e->errors());
            return response()->json(['error' => 'Validation failed', 'messages' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Unexpected error during validation: ' . $e->getMessage());
            return response()->json(['error' => 'Unexpected validation error', 'message' => $e->getMessage()], 500);
        }

        try {
            $user = $this->create($request->all());
            Log::info('User created: ', ['user' => $user]);
            $user->assignRole('merchant');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('User creation error: ' . $e->getMessage());
            return response()->json(['error' => 'User creation failed', 'message' => $e->getMessage()], 500);
        }

        try {
            $user->sendEmailVerificationNotification();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Email verification error: ' . $e->getMessage());
            return response()->json(['error' => 'Email verification failed', 'message' => $e->getMessage()], 500);
        }

        $response = response()->json([
            'status' => 'Success',
            'message' => 'Registration successful. Please wait for your account to be activated, and check your email regularly for activation instructions.'

        ], 200);

        return $response;
    }

    public function login(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email|max:255',
                'password' => 'required|string|min:6',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()->all()], 422);
            }
            $user = User::role('merchant')->where('email', $request->email)->first();
            if (!$user) {
                $response = ["message" => 'User does not exist'];
                return response()->json($response, 422);
            }
            if (!Hash::check($request->password, $user->password)) {
                $response = ["message" => "Password mismatch"];
                return response()->json($response, 422);
            }
            if ($user->isInactive()) {
                return response()->json([
                    'message' => 'User account is inactive. Please contact support for activation.'
                ], 422);
            }

            if ($user->isSuspended()) {
                return response()->json([
                    'message' => 'User account is suspended. Please contact support for more information.'
                ], 422);
            }

            Log::info('Client authentication successful');

            $data = [
                'grant_type' => 'password',
                // 'client_id' => env('PASSPORT_CLIENT_ID'),
                // 'client_secret' => env('PASSPORT_CLIENT_SECRET'),
                'client_id' => config('app.passport_client_id'),
                'client_secret' => config('app.passport_client_secret'),
                'username' => $request->email,
                'password' => $request->password,
                'scope' => '*',
            ];

            $oauthRequest = app('request')->create('/oauth/token', 'POST', $data);
            $oauthResponse = app()->handle($oauthRequest);


            // Prepare and return the response to the client
            $responseData = json_decode($oauthResponse->getContent(), true);

            return [
                'token_type' => $responseData['token_type'],
                'expires_in' => $responseData['expires_in'],
                'access_token' => $responseData['access_token'],
                'refresh_token' => $responseData['refresh_token'],
                'user' => $user,
            ];
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    // public function logout()
    // {
    //     auth()->logout();

    //     return response()->json(['message' => 'Successfully logged out']);
    // }

    // public function refresh()
    // {
    //     return $this->respondWithToken(auth()->refresh());
    // }

    // public function me()
    // {
    //     return response()->json(auth()->user());
    // }

}
