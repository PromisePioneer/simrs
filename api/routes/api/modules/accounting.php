<?php

use Domains\Accounting\Presentation\Controllers\AccountCategoryController;
use Domains\Accounting\Presentation\Controllers\AccountController;
use Domains\Accounting\Presentation\Controllers\JournalEntryController;
use Domains\Accounting\Presentation\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['module:Office'])->prefix('accounting')->group(function () {

    // ── Chart of Accounts ──────────────────────────────────────────────────
    Route::apiResource('account-categories', AccountCategoryController::class);
    Route::apiResource('accounts', AccountController::class);

    // ── Jurnal Entri ───────────────────────────────────────────────────────
    Route::prefix('journal')->group(function () {
        Route::get('/',  [JournalEntryController::class, 'index']);
        Route::post('/', [JournalEntryController::class, 'store']);
    });

    // ── Laporan Keuangan ───────────────────────────────────────────────────
    Route::prefix('reports')->group(function () {
        Route::get('/income-statement', [ReportController::class, 'incomeStatement']); // Laba Rugi
        Route::get('/trial-balance',    [ReportController::class, 'trialBalance']);    // Neraca Saldo
        Route::get('/balance-sheet',    [ReportController::class, 'balanceSheet']);    // Neraca
        Route::get('/cash-flow',        [ReportController::class, 'cashFlow']);        // Arus Kas
        Route::get('/ledger',           [ReportController::class, 'ledger']);          // Buku Besar
    });
});
