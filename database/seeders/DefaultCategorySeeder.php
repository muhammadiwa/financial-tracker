<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DefaultCategorySeeder extends Seeder
{
    public static $defaultCategories = [
        // Income categories
        [
            'name' => 'Gaji',
            'type' => 'income',
            'color' => '#22c55e'
        ],
        [
            'name' => 'Bonus',
            'type' => 'income',
            'color' => '#10b981'
        ],
        [
            'name' => 'Investasi',
            'type' => 'income',
            'color' => '#3b82f6'
        ],
        
        // Expense categories
        [
            'name' => 'Makanan & Minuman',
            'type' => 'expense',
            'color' => '#f97316'
        ],
        [
            'name' => 'Transportasi',
            'type' => 'expense',
            'color' => '#6b7280'
        ],
        [
            'name' => 'Belanja',
            'type' => 'expense',
            'color' => '#ec4899'
        ],
        [
            'name' => 'Tagihan',
            'type' => 'expense',
            'color' => '#ef4444'
        ],
        [
            'name' => 'Hiburan',
            'type' => 'expense',
            'color' => '#8b5cf6'
        ],
        [
            'name' => 'Kesehatan',
            'type' => 'expense',
            'color' => '#06b6d4'
        ],
        [
            'name' => 'Pendidikan',
            'type' => 'expense',
            'color' => '#f59e0b'
        ],
    ];
}