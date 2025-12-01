<?php

namespace App\Notifications;

use App\Mail\VerifyEmailViewMail;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;

class VerifyEmail extends \Illuminate\Auth\Notifications\VerifyEmail
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    public function toMail($notifiable): VerifyEmailViewMail|MailMessage
    {
        return (new VerifyEmailViewMail($notifiable))
            ->to($notifiable->email);
    }

    protected function verificationUrl($notifiable): string
    {
        return URL::temporarySignedRoute(
            'verification.verify.jsx',
            Carbon::now()->addMinutes(60),
            ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->email)]
        );
    }
}
