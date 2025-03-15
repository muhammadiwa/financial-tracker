<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule)
    {
        // Run at 00:01 on first day of every month
        $schedule->command('budgets:duplicate-monthly')
                ->monthlyOn(1, '00:01')
                ->runInBackground();

        $schedule->command('reminders:daily-transactions')->everyMinute();
    }
}