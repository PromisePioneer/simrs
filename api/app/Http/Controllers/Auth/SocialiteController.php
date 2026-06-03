<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Socialite;

class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')
            ->stateless()
            ->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')
                ->stateless()
                ->user();

            $user = User::updateOrCreate(
                ['email' => $googleUser->email],
                [
                    'name' => $googleUser->name,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'password' => bcrypt(str()->random(24)),
                    'email_verified_at' => now(),
                ]
            );

            $token = $user->createToken('google-token')->plainTextToken;

            return redirect(
                env('FRONTEND_URL', 'http://localhost:5173')
                . '/auth/callback?token=' . $token
            );

        } catch (\Exception $e) {
            return redirect(
                env('FRONTEND_URL') . '/login?error=google_failed'
            );
        }
    }
}
