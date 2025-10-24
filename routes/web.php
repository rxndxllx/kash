<?php

declare(strict_types=1);

use App\Http\Controllers\AccountController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::get("/", fn () => redirect()->route("login"))->name("home");

Route::middleware(["auth", "verified"])->group(function () {
    Route::get("onboarding", [OnboardingController::class, "index"])->name("onboarding");
    Route::post("onboarding/{step}/validate", [OnboardingController::class, "validate"])->name("onboarding.validate");
    Route::post("onboarding/complete", [OnboardingController::class, "complete"])->name("onboarding.complete");

    Route::get("dashboard", [DashboardController::class, "index"])->name("dashboard");

    Route::get("accounts", [AccountController::class, "index"])->name("accounts");
    Route::post("accounts", [AccountController::class, "store"])->name("create-account");
    Route::put("accounts/{account:id}", [AccountController::class, "update"])->name("edit-account");
    Route::delete("accounts/{account:id}", [AccountController::class, "destroy"])->name("delete-account");

    Route::get("transactions", [TransactionController::class, "index"])->name("transactions");
    Route::post("transactions", [TransactionController::class, "store"])->name("create-transaction");
    Route::put("transactions/{transaction:id}", [TransactionController::class, "update"])->name("edit-transaction");
});

require __DIR__."/settings.php";
require __DIR__."/auth.php";
require __DIR__."/data.php";
