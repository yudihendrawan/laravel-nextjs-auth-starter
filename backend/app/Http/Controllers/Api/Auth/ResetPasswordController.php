<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\PasswordResetToken;
use App\Models\User;
use App\Notifications\ResetPasswordSuccess;
use App\Notifications\SendResetPasswordNotification;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ResetPasswordController extends Controller
{

    public function forgotPassword(Request $request)
    {

        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Invalid email address.'
                ], 400);
            }

            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => "We can't find a user with that e-mail address."
                ], 404);
            }

            $exists = PasswordResetToken::where('email', $request->email)->first();
            if ($exists) {
                $passwordReset = $exists;
                $passwordReset->token = Str::random(60);
                $passwordReset->save();
            } else {
                $passwordReset = PasswordResetToken::create([
                    'email' => $user->email,
                    'token' => Str::random(60)
                ]);
            }

            if ($user && $passwordReset) {
                $user->notify(new SendResetPasswordNotification($passwordReset->token));
            }
            DB::commit();
            return response()->json([
                'message' => 'We have e-mailed your password reset link!'
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        try {
            DB::beginTransaction();
            $validator = Validator::make($request->all(), [
                'token' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                DB::rollBack();

                return response()->json([
                    'message' => 'Invalid data',
                    'errors' => $validator->errors()
                ], 400);
            }

            $passwordReset = PasswordResetToken::where('token', $request->token)->first();
            if (!$passwordReset)
                DB::rollBack();
            return response()->json([
                'message' => 'This password reset token is invalid.'
            ], 404);
            $user = User::where('email', $passwordReset->email)->first();

            if (Hash::check($request->password, $user->password)) {
                DB::rollBack();

                return response()->json([
                    'message' => 'Password cannot be the same as the previous password.'
                ], 400);
            }

            if (!$user)
                return response()->json([
                    'message' => "We can't find a user with that e-mail address."
                ], 404);
            $user->password = bcrypt($request->password);
            $user->save();
            $user->notify(new ResetPasswordSuccess());
            DB::commit();
            return response()->json([
                'data' => $user,
                'message' => 'Change password successfully'
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'message' => 'Something went wrong',
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function findEmail($token)
    {
        $passwordReset = PasswordResetToken::where('token', $token)->first();

        if (!$passwordReset) {
            return response()->json([
                'message' => 'This password reset token is invalid.'
            ], 404);
        }

        if ($passwordReset->created_at->addMinutes(720)->isPast()) {
            $passwordReset->delete();
            return response()->json([
                'message' => 'This password reset token has expired.'
            ], 404);
        }

        return response()->json($passwordReset);
    }
}
