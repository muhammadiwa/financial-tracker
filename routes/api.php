<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/{provider}', [AuthController::class, 'socialLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('budgets', BudgetController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::post('budgets/duplicate-monthly', [BudgetController::class, 'duplicateMonthly']);
    Route::get('/statistics/expense-by-category', [StatisticsController::class, 'expenseByCategory']);
    Route::get('/statistics/income-expense-balance', [StatisticsController::class, 'incomeExpenseBalance']);
    Route::get('/reports/monthly', [ReportController::class, 'monthlyReports']);
    Route::get('/reports/monthly/{month}', [ReportController::class, 'monthlyDetail']);
    Route::get('/reports/download/{month}', [ReportController::class, 'downloadReport']);
});
