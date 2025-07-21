<?php

declare(strict_types=1);

use App\Http\Controllers\Data\DataAccountController;
use App\Http\Controllers\Data\DataCategoryController;
use Illuminate\Support\Facades\Route;

/**
 * This the routes file for endpoints used for data fetching only.
 * Do not put endpoints here that returns or redirects to a page or view.
 */
Route::middleware("auth")->prefix("data")->group(function () {
    Route::get("accounts", [DataAccountController::class, "index"])->name("data.accounts");
    Route::get("categories", [DataCategoryController::class, "index"])->name("data.categories");
});
