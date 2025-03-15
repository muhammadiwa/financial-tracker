<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Category;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $query = Budget::with('category')
            ->where('user_id', auth()->id());

        // Filter by month/year from created_at
        if ($request->has(['month', 'year'])) {
            $query->whereMonth('created_at', $request->month)
                  ->whereYear('created_at', $request->year);
        } else {
            // Default to current month
            $query->whereMonth('created_at', now()->month)
                  ->whereYear('created_at', now()->year);
        }

        $budgets = $query->get();

        // If no budgets found for current month, duplicate from last month
        if ($budgets->isEmpty() && !$request->has(['month', 'year'])) {
            $this->duplicateMonthly();
            return $this->index($request); // Recall index to get new budgets
        }

        return response()->json([
            'status' => 'success',
            'data' => $budgets->map(function ($budget) {
                return [
                    'id' => $budget->id,
                    'category' => $budget->category->name,
                    'category_id' => $budget->category_id,
                    'amount' => $budget->amount,
                    'spent' => $budget->spent,
                    'period' => $budget->period,
                    'color' => $budget->category->color,
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0',
            'period' => 'required|in:weekly,monthly,yearly',
        ]);

        $budget = auth()->user()->budgets()->create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Anggaran berhasil ditambahkan',
            'data' => [
                'id' => $budget->id,
                'category' => $budget->category->name,
                'amount' => $budget->amount,
                'spent' => $budget->spent,
                'period' => $budget->period,
                'color' => $budget->category->color,
            ]
        ], 201);
    }

    public function update(Request $request, Budget $budget)
    {
        if ($budget->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric|min:0',
            'period' => 'required|in:weekly,monthly,yearly',
        ]);

        $budget->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Anggaran berhasil diperbarui',
            'data' => [
                'id' => $budget->id,
                'category' => $budget->category->name,
                'amount' => $budget->amount,
                'spent' => $budget->spent,
                'period' => $budget->period,
                'color' => $budget->category->color,
            ]
        ]);
    }

    public function destroy(Budget $budget)
    {
        if ($budget->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $budget->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Anggaran berhasil dihapus'
        ]);
    }

    public function duplicateMonthly()
    {
        // Get all users who had budgets last month
        $users = Budget::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->select('user_id')
            ->distinct()
            ->get();

        foreach ($users as $user) {
            // Get last month's budgets for each user
            $lastMonthBudgets = Budget::where('user_id', $user->user_id)
                ->whereMonth('created_at', now()->subMonth()->month)
                ->whereYear('created_at', now()->subMonth()->year)
                ->get();

            // Duplicate budgets for current month with reset spent amount
            foreach ($lastMonthBudgets as $budget) {
                Budget::create([
                    'user_id' => $budget->user_id,
                    'category_id' => $budget->category_id,
                    'amount' => $budget->amount,
                    'spent' => 0, // Reset spent amount
                    'period' => $budget->period,
                ]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Anggaran bulan baru berhasil dibuat untuk semua pengguna'
        ]);
    }
}