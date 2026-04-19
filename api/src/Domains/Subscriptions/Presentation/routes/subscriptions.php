<?php

use Domains\Subscriptions\Presentation\Controllers\OrderController;
use Domains\Subscriptions\Presentation\Controllers\PlanController;
use Domains\Subscriptions\Presentation\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Subscriptions Domain Routes
|--------------------------------------------------------------------------
*/

// Webhook Xendit — TANPA auth & CSRF middleware
Route::post('orders/webhook', [OrderController::class, 'handleWebhook'])
    ->name('orders.webhook');

Route::middleware(['auth:sanctum'])->group(function () {

    // Plans (admin/public)
    Route::prefix('plans')->name('plans.')->group(function () {
        Route::get('/',              [PlanController::class, 'index'])->name('index');
        Route::get('/{id}',          [PlanController::class, 'show'])->name('show');
        Route::post('/',             [PlanController::class, 'store'])->name('store');
        Route::put('/{id}',          [PlanController::class, 'update'])->name('update');
        Route::delete('/{id}',       [PlanController::class, 'destroy'])->name('destroy');
        Route::delete('/bulk',       [PlanController::class, 'bulkDestroy'])->name('bulk-destroy');
    });

    // Subscriptions
    Route::prefix('subscriptions')->name('subscriptions.')->group(function () {
        Route::get('/active',              [SubscriptionController::class, 'active'])->name('active');
        Route::post('/assign/{planId}',    [SubscriptionController::class, 'assignSubs'])->name('assign');
    });

    // Orders + Xendit Payment
    Route::prefix('orders')->name('orders.')->group(function () {
        Route::post('/',         [OrderController::class, 'createOrder'])->name('create');
        Route::get('/active',    [OrderController::class, 'activeOrder'])->name('active');
    });

});
