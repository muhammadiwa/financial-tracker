<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $currentMonth = Carbon::now();
            $lastMonth = Carbon::now()->subMonth();
            
            // Current month data
            $currentMonthIncome = Transaction::where('user_id', auth()->id())
                ->where('type', 'income')
                ->whereYear('date', $currentMonth->year)
                ->whereMonth('date', $currentMonth->month)
                ->sum('amount');

            $currentMonthExpense = Transaction::where('user_id', auth()->id())
                ->where('type', 'expense')
                ->whereYear('date', $currentMonth->year)
                ->whereMonth('date', $currentMonth->month)
                ->sum('amount');

            // Last month data
            $lastMonthIncome = Transaction::where('user_id', auth()->id())
                ->where('type', 'income')
                ->whereYear('date', $lastMonth->year)
                ->whereMonth('date', $lastMonth->month)
                ->sum('amount');

            $lastMonthExpense = Transaction::where('user_id', auth()->id())
                ->where('type', 'expense')
                ->whereYear('date', $lastMonth->year)
                ->whereMonth('date', $lastMonth->month)
                ->sum('amount');

            // Calculate percentages
            $incomeChange = $lastMonthIncome > 0 
                ? (($currentMonthIncome - $lastMonthIncome) / $lastMonthIncome) * 100 
                : 0;
            $expenseChange = $lastMonthExpense > 0 
                ? (($currentMonthExpense - $lastMonthExpense) / $lastMonthExpense) * 100 
                : 0;
            $balanceChange = $lastMonthIncome - $lastMonthExpense !== 0 
                ? ((($currentMonthIncome - $currentMonthExpense) - ($lastMonthIncome - $lastMonthExpense)) / abs($lastMonthIncome - $lastMonthExpense)) * 100 
                : 0;

            $transactions = Transaction::with('category')
                ->where('user_id', auth()->id())
                ->whereYear('date', $currentMonth->year)
                ->whereMonth('date', $currentMonth->month)
                ->orderBy('date', 'desc')
                ->limit(5)
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'transactions' => $transactions->map(function ($transaction) {
                        return [
                            'id' => $transaction->id,
                            'amount' => $transaction->amount,
                            'type' => $transaction->type,
                            'description' => $transaction->description,
                            'date' => $transaction->date->format('Y-m-d'), // Fix: Format date consistently
                            'category' => $transaction->category->name,
                            'color' => $transaction->category->color
                        ];
                    }),
                    'summary' => [
                        'income' => $currentMonthIncome,
                        'expense' => $currentMonthExpense,
                        'balance' => $currentMonthIncome - $currentMonthExpense,
                        'comparison' => [
                            'income' => round($incomeChange, 1),
                            'expense' => round($expenseChange, 1),
                            'balance' => round($balanceChange, 1)
                        ]
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch dashboard data'
            ], 500);
        }
    }
}