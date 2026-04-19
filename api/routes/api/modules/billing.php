<?php

use Domains\Billing\Presentation\Controllers\InpatientBillController;
use Domains\Billing\Presentation\Controllers\OutpatientBillController;
use Illuminate\Support\Facades\Route;

Route::middleware(['module:Rawat Jalan'])->prefix('billing')->group(function () {

    // ── Tagihan Rawat Jalan ────────────────────────────────────────────────
    Route::prefix('outpatient')->group(function () {
        Route::get('/', [OutpatientBillController::class, 'index']);
        Route::get('/{bill}', [OutpatientBillController::class, 'show']);
        Route::post('/from-visit/{visit}', [OutpatientBillController::class, 'createFromVisit']);
        Route::put('/{bill}/items', [OutpatientBillController::class, 'updateItems']);
        Route::post('/{bill}/pay', [OutpatientBillController::class, 'pay']);
        Route::post('/{bill}/cancel', [OutpatientBillController::class, 'cancel']);
    });
});

Route::middleware(['module:Rawat Inap'])->prefix('billing')->group(function () {

    // ── Tagihan Rawat Inap ─────────────────────────────────────────────────
    Route::prefix('inpatient')->group(function () {
        Route::get('/', [InpatientBillController::class, 'index']);
        Route::get('/{bill}', [InpatientBillController::class, 'show']);
        Route::post('/from-admission/{admission}', [InpatientBillController::class, 'createFromAdmission']);
        Route::put('/{bill}/items', [InpatientBillController::class, 'updateItems']);
        Route::post('/{bill}/pay', [InpatientBillController::class, 'pay']);
        Route::post('/{bill}/cancel', [InpatientBillController::class, 'cancel']);
    });
});
