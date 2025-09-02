<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("dashboard_stats", function (Blueprint $table) {
            $table->id();
            $table->string("currency");
            $table->integer("month");
            $table->integer("year");
            $table->double("total_balance");
            $table->double("total_income");
            $table->double("total_expense");
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("dashboard_stats");
    }
};
