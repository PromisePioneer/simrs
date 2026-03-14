<?php

use App\Http\Controllers\Api\Accounting\AccountCategoryController;
use App\Http\Controllers\Api\Accounting\AccountController;
use Illuminate\Support\Facades\Route;

// ── Pro only ──────────────────────────────────────────────────────────────────
Route::middleware(['module:Office'])->group(function () {
    Route::prefix('accounting')->group(function () {
        Route::apiResource('account-categories', AccountCategoryController::class);
    });

    Route::apiResource('accounts', AccountController::class);
});
