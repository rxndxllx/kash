<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("transactions", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained("users");
            $table->foreignId("account_id")->constrained("accounts");
            $table->foreignId("category_id")->nullable()->constrained("categories");
            $table->foreignId("transfer_id")->nullable()->constrained("transfers")->onDelete("cascade");
            $table->double("amount");
            $table->string("type");
            $table->double("running_balance");
            $table->timestamp("transacted_at");
            $table->string("note")->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("transactions");
    }
};
