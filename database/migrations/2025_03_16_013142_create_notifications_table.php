<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        // Add notification settings column to users table
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('notification_enabled')->default(false);
            $table->time('notification_time')->default('20:00:00');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['notification_enabled', 'notification_time']);
        });
    }
};
