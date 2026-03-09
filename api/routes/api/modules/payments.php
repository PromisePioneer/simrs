<?php


use App\Http\Controllers\Api\Payments\OrderController;

Route::prefix('orders')->group(function () {
    Route::post('/generate', [OrderController::class, 'createOrder']);
});
