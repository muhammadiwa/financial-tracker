<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    protected function getDateRange($period)
    {
        $now = Carbon::now();
        
        switch ($period) {
            case 'week':
                return [
                    'start' => $now->startOfWeek(),
                    'end' => $now->clone()->endOfWeek()
                ];
            case 'month':
                return [
                    'start' => $now->startOfMonth(),
                    'end' => $now->clone()->endOfMonth()
                ];
            case 'year':
                return [
                    'start' => $now->startOfYear(),
                    'end' => $now->clone()->endOfYear()
                ];
            case 'last_week':
                return [
                    'start' => $now->subWeek()->startOfWeek(),
                    'end' => $now->clone()->endOfWeek()
                ];
            case 'last_month':
                return [
                    'start' => $now->subMonth()->startOfMonth(),
                    'end' => $now->clone()->endOfMonth()
                ];
            case 'last_year':
                return [
                    'start' => $now->subYear()->startOfYear(),
                    'end' => $now->clone()->endOfYear()
                ];
            default:
                return [
                    'start' => $now->startOfMonth(),
                    'end' => $now->clone()->endOfMonth()
                ];
        }
    }

    public function expenseByCategory(Request $request)
    {
        $dateRange = $this->getDateRange($request->period ?? 'month');

        $expenses = Transaction::where('user_id', auth()->id())
            ->where('type', 'expense')
            ->whereBetween('date', [$dateRange['start'], $dateRange['end']])
            ->with('category')
            ->get()
            ->groupBy('category_id')
            ->map(function ($transactions) {
                $category = $transactions->first()->category;
                return [
                    'name' => $category->name,
                    'value' => $transactions->sum('amount'),
                    'color' => $category->color
                ];
            })
            ->values();

        return response()->json([
            'status' => 'success',
            'data' => $expenses
        ]);
    }

    public function incomeExpenseBalance(Request $request)
    {
        $dateRange = $this->getDateRange($request->period ?? 'month');

        if ($request->period === 'year' || $request->period === 'last_year') {
            // Group by months for yearly view
            $data = [];
            $start = Carbon::parse($dateRange['start']);
            $end = Carbon::parse($dateRange['end']);

            for ($date = $start; $date <= $end; $date->addMonth()) {
                $monthData = Transaction::where('user_id', auth()->id())
                    ->whereYear('date', $date->year)
                    ->whereMonth('date', $date->month)
                    ->selectRaw('
                        SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income,
                        SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expense
                    ')
                    ->first();

                $data[] = [
                    'name' => $date->format('M'),
                    'income' => $monthData->income ?? 0,
                    'expense' => $monthData->expense ?? 0,
                    'balance' => ($monthData->income ?? 0) - ($monthData->expense ?? 0)
                ];
            }
        } else {
            // Daily grouping for week/month view
            $transactions = Transaction::where('user_id', auth()->id())
                ->whereBetween('date', [$dateRange['start'], $dateRange['end']])
                ->get()
                ->groupBy(function($transaction) {
                    return Carbon::parse($transaction->date)->format('d M');
                })
                ->map(function ($dayTransactions) {
                    $income = $dayTransactions->where('type', 'income')->sum('amount');
                    $expense = $dayTransactions->where('type', 'expense')->sum('amount');
                    return [
                        'income' => $income,
                        'expense' => $expense,
                        'balance' => $income - $expense
                    ];
                });

            $data = $transactions->map(function ($item, $date) {
                return array_merge(['name' => $date], $item);
            })->values();
        }

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }
}
