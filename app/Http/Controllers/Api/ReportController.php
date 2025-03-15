<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;
use PDF;

class ReportController extends Controller 
{
    public function monthlyReports(Request $request)
    {
        $year = $request->year ?? now()->year;
        
        $reports = [];
        for ($month = 1; $month <= 12; $month++) {
            $transactions = Transaction::where('user_id', auth()->id())
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->get();

            if ($transactions->isNotEmpty()) {
                $income = $transactions->where('type', 'income')->sum('amount');
                $expense = $transactions->where('type', 'expense')->sum('amount');
                
                $reports[] = [
                    'id' => $month,
                    'month' => Carbon::create()->month($month)->format('F'),
                    'year' => $year,
                    'income' => $income,
                    'expense' => $expense,
                    'balance' => $income - $expense
                ];
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => $reports
        ]);
    }

    public function monthlyDetail(Request $request, $month)
    {
        $year = $request->year ?? now()->year;
        
        $transactions = Transaction::with('category')
            ->where('user_id', auth()->id())
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'date' => $transaction->date,
                    'type' => $transaction->type,
                    'category' => $transaction->category->name,
                    'amount' => $transaction->amount,
                    'description' => $transaction->description
                ];
            });

        $summary = [
            'income' => $transactions->where('type', 'income')->sum('amount'),
            'expense' => $transactions->where('type', 'expense')->sum('amount')
        ];

        return response()->json([
            'status' => 'success',
            'data' => [
                'transactions' => $transactions,
                'summary' => $summary
            ]
        ]);
    }

    public function downloadReport(Request $request, $month)
    {
        try {
            $year = $request->year ?? now()->year;
            $monthNumber = (int) $month;
            
            $transactions = Transaction::with('category')
                ->where('user_id', auth()->id())
                ->whereYear('date', $year)
                ->whereMonth('date', $monthNumber)
                ->orderBy('date', 'asc')
                ->get();

            $monthName = Carbon::create()->month($monthNumber)->format('F');

            $data = [
                'transactions' => $transactions,
                'month' => $monthName,
                'year' => $year,
                'income' => $transactions->where('type', 'income')->sum('amount'),
                'expense' => $transactions->where('type', 'expense')->sum('amount')
            ];

            $pdf = PDF::loadView('reports.monthly', $data);
            
            return $pdf->download("transaksi-{$monthName}-{$year}.pdf");
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate report: ' . $e->getMessage()
            ], 500);
        }
    }
}