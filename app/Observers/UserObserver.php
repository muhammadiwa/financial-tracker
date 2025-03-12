<?php

namespace App\Observers;

use App\Models\User;
use Database\Seeders\DefaultCategorySeeder;

class UserObserver
{
    public function created(User $user)
    {
        // Create default categories for new user
        foreach (DefaultCategorySeeder::$defaultCategories as $category) {
            $user->categories()->create($category);
        }
    }
}