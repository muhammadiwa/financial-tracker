<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\BudgetController;
use App\Http\Controllers\Api\StatisticsController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/{provider}', [AuthController::class, 'socialLogin']);
Route::post('/login/google', [AuthController::class, 'googleLogin']); // Route sudah benar
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('budgets', BudgetController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::post('budgets/duplicate-monthly', [BudgetController::class, 'duplicateMonthly']);
    Route::get('/statistics/expense-by-category', [StatisticsController::class, 'expenseByCategory']);
    Route::get('/statistics/income-expense-balance', [StatisticsController::class, 'incomeExpenseBalance']);
    Route::get('/reports/monthly', [ReportController::class, 'monthlyReports']);
    Route::get('/reports/monthly/{month}', [ReportController::class, 'monthlyDetail']);
    Route::get('/reports/download/{month}', [ReportController::class, 'downloadReport']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);
    Route::get('/notifications/settings', [NotificationController::class, 'getSettings']);
    Route::put('/notifications/settings', [NotificationController::class, 'updateSettings']);
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});
