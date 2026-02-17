<?php

use App\Http\Controllers\Api\Master\General\Module\ModuleController;
use App\Http\Controllers\Api\Master\General\Subscriptions\PlanController;
use App\Http\Controllers\Api\Master\General\User\Permission\PermissionController;
use App\Http\Controllers\Api\Master\General\User\Role\RoleController;
use App\Http\Controllers\Api\Master\General\User\User\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('modules')->group(function () {
    Route::get('/data', [ModuleController::class, 'data']);
});

Route::prefix('subscriptions')->group(function () {
    Route::prefix('plans')->group(function () {
        Route::apiResource('/', PlanController::class);
        Route::post('/bulk-destroy', [PlanController::class, 'bulkDestroy']);
    });
});


Route::prefix('modules')->group(function () {
    Route::apiResource('/', ModuleController::class);
    Route::put('/updated-module', [ModuleController::class, 'updatedModule']);
});

Route::apiResource('permissions', PermissionController::class);


Route::prefix('users')->group(function () {
    Route::apiResource('/', UserController::class);
});

Route::prefix('roles')->group(function () {
    Route::apiResource('/', RoleController::class);
    Route::get('/tenant/{tenant}', [RoleController::class, 'getByTenant']);
});


