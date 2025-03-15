<?php

namespace App\Http\Controllers\Api;

use App\Models\Budget;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::query()
            ->with('category')
            ->where('user_id', auth()->id());

        // Add month and year filtering
        if ($request->has(['month', 'year'])) {
            $query->whereYear('date', $request->year)
                  ->whereMonth('date', $request->month);
        }

        $transactions = $query->orderBy('date', 'desc')
                             ->orderBy('created_at', 'desc')
                             ->get();

        return response()->json([
            'status' => 'success',
            'data' => $transactions->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'description' => $transaction->description,
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                    'category' => $transaction->category->name,
                    'category_id' => $transaction->category_id,
                    'color' => $transaction->category->color,
                    'date' => $transaction->date->format('Y-m-d'),
                ];
            })
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'description' => 'nullable|string|max:255', // Make description optional
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:income,expense',
            'category_id' => 'required|exists:categories,id',
            'date' => 'required|date',
        ]);

        DB::beginTransaction();
        try {
            $transaction = auth()->user()->transactions()->create($validatedData);
            $transaction->load('category');

            // Clear cache
            Cache::forget("transactions_" . auth()->id());

            $matchingBudget = Budget::where('user_id', auth()->id())
                ->where('category_id', $validatedData['category_id'])
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->first();

            if (!$matchingBudget) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'No matching budget found for this category'
                ]);
            }

            // Update spent amount
            $matchingBudget->spent += $validatedData['amount'];
            $matchingBudget->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil ditambahkan',
                'data' => [
                    'id' => $transaction->id,
                    'description' => $transaction->description,
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                    'category' => $transaction->category->name,
                    'category_id' => $transaction->category_id,
                    'color' => $transaction->category->color,
                    'date' => $transaction->date->format('Y-m-d'),
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                // 'message' => 'Gagal menambahkan transaksi'
            ], 500);
        }
    }

    public function update(Request $request, Transaction $transaction)
    {
        if ($transaction->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validatedData = $request->validate([
            'description' => 'nullable|string|max:255', // Make description optional
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:income,expense',
            'category_id' => 'required|exists:categories,id',
            'date' => 'required|date',
        ]);

        DB::beginTransaction();
        try {
            $transaction->update($validatedData);
            $transaction->load('category');

            // Clear cache
            Cache::forget("transactions_" . auth()->id());

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil diperbarui',
                'data' => [
                    'id' => $transaction->id,
                    'description' => $transaction->description,
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                    'category' => $transaction->category->name,
                    'category_id' => $transaction->category_id,
                    'color' => $transaction->category->color,
                    'date' => $transaction->date->format('Y-m-d'),
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui transaksi'
            ], 500);
        }
    }

    public function destroy(Transaction $transaction)
    {
        if ($transaction->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        DB::beginTransaction();
        try {
            $transaction->delete();

            // Clear cache
            Cache::forget("transactions_" . auth()->id());

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus transaksi'
            ], 500);
        }
    }

    public function show(Transaction $transaction)
    {
        // Check if the transaction belongs to the authenticated user
        if ($transaction->user_id !== auth()->id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Load the category relationship
        $transaction->load('category');

        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $transaction->id,
                'description' => $transaction->description,
                'amount' => $transaction->amount,
                'type' => $transaction->type,
                'category' => $transaction->category->name,
                'category_id' => $transaction->category_id,
                'color' => $transaction->category->color,
                'date' => $transaction->date->format('Y-m-d'),
            ]
        ]);
    }
}
