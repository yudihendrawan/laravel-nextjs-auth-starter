<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendResetPasswordNotification extends Notification
{
    use Queueable;
    protected $token;
    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

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
        $frontEnd = config('app.frontend_url');
        $url = url($frontEnd . '/forgot-password/' . $this->token);

        return (new MailMessage)
            ->subject('Password Reset Request')
            ->greeting('Hello!')
            ->line('We received a request to reset your password. If you did not make this request, you can ignore this email.')
            ->line('To reset your password, please click the button below:')
            ->action('Reset Your Password', $url)
            ->line("If you’re having trouble clicking the button, copy and paste the URL below into your web browser:")
            ->line($url)
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
            //
        ];
    }
}
