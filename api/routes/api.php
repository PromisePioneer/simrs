<?php

use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\Master\General\Tenant\TenantController;
use App\Http\Controllers\Api\Master\General\User\User\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Super Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'role:Super Admin'])
    ->prefix('v1')
    ->group(function () {
        Route::apiResource('tenants', TenantController::class);
    });

/*
|--------------------------------------------------------------------------
| Regional Routes
|--------------------------------------------------------------------------
*/
require __DIR__ . '/api/region.php';

/*
|--------------------------------------------------------------------------
| Email Verification Routes
|--------------------------------------------------------------------------
*/
Route::prefix('email')
    ->group(function () {
        Route::get('/verify.jsx', [EmailVerificationController::class, 'verify'])
            ->name('api.verification.verify.jsx');

        Route::post('/verification-notification', [EmailVerificationController::class, 'resend'])
            ->middleware(['auth:sanctum', 'throttle:6,1'])
            ->name('verification.send');
    });

/*
|--------------------------------------------------------------------------
| Authenticated API Routes (v1)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'verified'])
    ->prefix('v1')
    ->name('api.v1.')
    ->group(function () {
        // User Profile
        Route::get('/me', [UserController::class, 'me'])->name('me');

        /*
        |--------------------------------------------------------------------------
        | Application Core Module
        |--------------------------------------------------------------------------
        */
        require __DIR__ . '/api/modules/application.php';

        /*
        |--------------------------------------------------------------------------
        | Accounting Module
        |--------------------------------------------------------------------------
        */
        require __DIR__ . '/api/modules/accounting.php';

        /*
        |--------------------------------------------------------------------------
        | Healthcare Management Module
        |--------------------------------------------------------------------------
        */
        require __DIR__ . '/api/modules/healthcare.php';

        /*
        |--------------------------------------------------------------------------
        | Pharmacy Module
        |--------------------------------------------------------------------------
        */
        require __DIR__ . '/api/modules/pharmacy.php';


        /*
          |--------------------------------------------------------------------------
          | Payments Module
          |--------------------------------------------------------------------------
         */

        require __DIR__ . '/api/modules/payments.php';
    });
