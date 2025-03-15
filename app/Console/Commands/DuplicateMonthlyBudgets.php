<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Api\BudgetController;

class DuplicateMonthlyBudgets extends Command
{
    protected $signature = 'budgets:duplicate-monthly';
    protected $description = 'Duplicate last month budgets to current month';

    public function handle()
    {
        $budgetController = new BudgetController();
        $budgetController->duplicateMonthly();
        
        $this->info('Monthly budgets have been duplicated successfully.');
    }
}