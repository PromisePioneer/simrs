<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class VerifyEmailViewMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $verificationUrl;

    public function __construct($user)
    {
        $this->user = $user;
        $this->verificationUrl = $this->generateVerificationUrl($user);
    }

    protected function generateVerificationUrl($user): string
    {
        $temporarySignedUrl = URL::temporarySignedRoute(
            'verification.verify.jsx',
            Carbon::now()->addMinutes(60),
            [
                'id' => $user->getKey(),
                'hash' => sha1($user->email),
            ]
        );

        $parsed = parse_url($temporarySignedUrl);

        parse_str($parsed['query'], $queryArray);

        $queryArray['id'] = $user->getKey();
        $queryArray['hash'] = sha1($user->email);

        $frontend = config('app.frontend_url');

        return $frontend . '/email/verify.jsx?' . http_build_query($queryArray);
    }


    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verifikasi Email Anda',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'email.email-verification',
            with: [
                'url' => $this->verificationUrl,
                'user' => $this->user,
            ]
        );
    }


    public function attachments(): array
    {
        return [];
    }
}
