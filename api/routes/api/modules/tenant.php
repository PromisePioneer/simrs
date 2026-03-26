<?php

use Domains\Tenant\Presentation\Controllers\TenantController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Tenant Routes
| Base prefix : /api/v1  (set by api.php parent group)
| Middleware  : auth:sanctum (set by api.php parent group)
|--------------------------------------------------------------------------
*/

Route::prefix('/tenants')->group(function () {
    Route::apiResource('/', TenantController::class)
        ->parameters(['' => 'tenant']);

    Route::post('/switch', [TenantController::class, 'switchTenant'])
        ->name('tenants.switch');

    Route::post('/reset', [TenantController::class, 'resetTenant'])
        ->name('tenants.reset');
});
