<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Auth\Passwords\CanResetPassword;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, CanResetPassword;

    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'email_verified_at',
        'notification_enabled',
        'notification_time',
        'provider',
        'provider_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Add this relationship method
    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function budgets()
    {
        return $this->hasMany(Budget::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
