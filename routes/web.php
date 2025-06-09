<?php

declare(strict_types=1);

use App\Http\Controllers\AccountController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", fn () => redirect()->route("login"))->name("home");

Route::middleware(["auth", "verified"])->group(function () {
    Route::get("dashboard", function () {
        return Inertia::render("dashboard");
    })->name("dashboard");

    Route::get("accounts", [AccountController::class, "index"])->name("accounts");
});

require __DIR__."/settings.php";
require __DIR__."/auth.php";
