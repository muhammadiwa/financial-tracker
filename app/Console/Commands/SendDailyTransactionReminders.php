<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\DailyTransactionReminder;
use Illuminate\Console\Command;

class SendDailyTransactionReminders extends Command
{
    protected $signature = 'reminders:daily-transactions';
    protected $description = 'Send daily transaction reminders to users';

    public function handle()
    {
        $currentTime = now()->format('H:i');
        
        User::where('notification_enabled', true)
            ->where('notification_time', $currentTime)
            ->chunk(100, function ($users) {
                foreach ($users as $user) {
                    $user->notify(new DailyTransactionReminder());
                }
            });

        $this->info('Daily transaction reminders sent successfully.');
    }
}