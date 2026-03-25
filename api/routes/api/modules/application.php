<?php

use App\Http\Controllers\Api\Master\General\Subscriptions\PlanController;
use App\Http\Controllers\Api\Master\General\Subscriptions\SubscriptionController;
use Domains\IAM\Presentation\Controllers\ModuleController;
use Domains\IAM\Presentation\Controllers\PermissionController;
use Domains\IAM\Presentation\Controllers\RoleController;
use Domains\IAM\Presentation\Controllers\UserController;
use Illuminate\Support\Facades\Route;


Route::get('/modules', [ModuleController::class, 'index']);

Route::prefix('subscriptions')->group(function () {
    Route::get('/active', [SubscriptionController::class, 'active']);
    Route::post('/assign/{plan}', [SubscriptionController::class, 'assignSubs']);

    Route::prefix('plans')->group(function () {
        Route::apiResource('/', PlanController::class);
        Route::post('/bulk-destroy', [PlanController::class, 'bulkDestroy']);
    });
});

Route::middleware(['module:Setting'])->group(function () {
    Route::apiResource('permissions', PermissionController::class);

    Route::prefix('roles')->group(function () {
        Route::apiResource('/', RoleController::class);
        Route::get('/tenant/{tenant}', [RoleController::class, 'getByTenant']);
    });

    Route::apiResource('users', UserController::class);

    Route::prefix('modules')->group(function () {
        Route::get('/data', [ModuleController::class, 'data']);
        Route::apiResource('/', ModuleController::class)->except(['index']);
        Route::put('/updated-module', [ModuleController::class, 'updatedModule']);
    });
});
