<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\BudgetController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/{provider}', [AuthController::class, 'socialLogin']);

Route::middleware('auth:api')->group(function () {
    // Categories
    Route::apiResource('categories', CategoryController::class);
    
    // Transactions
    Route::apiResource('transactions', TransactionController::class);
    
    // Budgets
    Route::apiResource('budgets', BudgetController::class);
    
});
