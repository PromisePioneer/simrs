<?php

use App\Http\Controllers\Api\Payments\OrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('orders')->group(function () {
    // Buat order baru + generate Xendit invoice
    Route::post('/generate', [OrderController::class, 'createOrder']);

    // Cek status order aktif tenant
    Route::get('/active', [OrderController::class, 'activeOrder']);

    // Xendit webhook — tidak pakai auth, pakai token validation
    Route::post('/webhook/xendit', [OrderController::class, 'handleWebhook'])
        ->withoutMiddleware(['auth:sanctum', 'verified']);
});
