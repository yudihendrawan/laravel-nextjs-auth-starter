<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordSuccess extends Notification
{
    use Queueable;

    protected $token;

    /**
     * Create a new notification instance.
     */
    public function __construct() {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {

        return (new MailMessage)
            ->subject('Your Password Has Been Successfully Reset')
            ->greeting('Hello!')
            ->line('We are pleased to inform you that your password has been successfully reset.')
            ->line('If you did not request this change, please contact our support team immediately.')
            // ->action('Go to Your Account', url('/account'))
            ->line('Thank you for using our application!')
            ->salutation('Best regards,')
            ->line('The ' . config('app.name') . ' Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            // Data tambahan yang ingin kamu sertakan dalam notifikasi array
        ];
    }
}
