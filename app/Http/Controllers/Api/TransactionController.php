<?php

namespace App\Http\Controllers\Api;

use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();
        $cacheKey = "transactions_{$userId}";

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($userId) {
            return Transaction::with('category')
                ->where('user_id', $userId)
                ->orderBy('date', 'desc')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($transaction) {
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
                });
        });
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
}
