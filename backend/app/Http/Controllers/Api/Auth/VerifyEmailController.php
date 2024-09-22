<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;


class VerifyEmailController extends Controller
{
    public function __invoke(Request $request): RedirectResponse
    {
        $user = User::find($request->route('id'));
        if ($user->hasVerifiedEmail()) {
            return redirect(config('app.frontend_url'));
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
            $frontendUrl = config('app.frontend_url');
            return redirect($frontendUrl . '/email/verified-success');
        }
        return redirect(config('app.frontend_url'));
    }
    public function resend($uuid)
    {

        try {
            $user = User::where('uuid', $uuid)->first();
            if ($user->hasVerifiedEmail()) {
                return redirect(config('app.frontend_url'));
            }
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found'
                ], 404);
            }

            $user->sendEmailVerificationNotification();
            return response()->json([
                'status' => 200,
                'message' => 'Link Verification sent'
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }



        // return redirect(env('FRONT_URL') . '/email/verify/success');
        // return redirect('http://localhost:3000');
    }
}
