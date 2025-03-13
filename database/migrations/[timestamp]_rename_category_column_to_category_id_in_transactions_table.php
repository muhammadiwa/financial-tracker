<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->renameColumn('category', 'category_id');
            $table->integer('category_id')->change();
            $table->string('description')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->renameColumn('category_id', 'category');
            $table->string('category')->change();
        });
    }
};
