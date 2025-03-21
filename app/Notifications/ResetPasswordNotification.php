<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    protected $token;
    protected $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $resetUrl = config('app.frontend_url') . '/reset-password?' . http_build_query([
            'token' => $this->token,
            'email' => $this->email
        ]);

        return (new MailMessage)
            ->subject('Reset Password Notification')
            ->view('emails.reset-password', [
                'resetUrl' => $resetUrl,
                'user' => $notifiable
            ]);
    }
}