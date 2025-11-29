<?php


use App\Http\Controllers\Api\Master\General\Region\DistrictController;
use App\Http\Controllers\Api\Master\General\Region\ProvinceController;
use App\Http\Controllers\Api\Master\General\Region\RegencyController;
use App\Http\Controllers\Api\Master\General\Region\VillageController;

Route::prefix('/regions')->group(function () {
    Route::prefix('districts')->group(function () {
        Route::get('/', [DistrictController::class, 'index']);
    });

    Route::prefix('regencies')->group(function () {
        Route::get('/', [RegencyController::class, 'index']);
    });

    Route::prefix('villages')->group(function () {
        Route::get('/', [VillageController::class, 'index']);
    });

    Route::prefix('provinces')->group(function () {
        Route::get('/', [ProvinceController::class, 'index']);
    });
});
