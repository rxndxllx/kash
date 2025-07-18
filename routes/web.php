<?php

declare(strict_types=1);

use App\Http\Controllers\AccountController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", fn () => redirect()->route("login"))->name("home");

Route::middleware(["auth", "verified"])->group(function () {
    Route::get("dashboard", function () {
        return Inertia::render("dashboard");
    })->name("dashboard");

    Route::get("accounts", [AccountController::class, "index"])->name("accounts");
    Route::post("accounts", [AccountController::class, "store"])->name("create-account");
    Route::put("accounts/{account:id}", [AccountController::class, "update"])->name("edit-account");

    Route::get("transactions", [TransactionController::class, "index"])->name("transactions");
    Route::post("transactions", [TransactionController::class, "store"])->name("create-transaction");
});

require __DIR__."/settings.php";
require __DIR__."/auth.php";
require __DIR__."/data.php";
