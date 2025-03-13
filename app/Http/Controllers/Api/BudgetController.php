<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Category;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = auth()->user()->budgets()
            ->with('category')
            ->get()
            ->map(function ($budget) {
                return [
                    'id' => $budget->id,
                    'category' => $budget->category->name,
                    'category_id' => $budget->category_id, // Make sure this is included
                    'amount' => $budget->amount,
                    'spent' => $budget->spent,
                    'period' => $budget->period,
                    'color' => $budget->category->color,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $budgets
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
}