<?php

use App\Http\Controllers\Api\Master\Pharmachy\Product\ProductController;
use App\Http\Controllers\Api\Master\Pharmachy\ProductCategory\ProductCategoryController;
use App\Http\Controllers\Api\Master\Pharmachy\ProductRack\ProductRackController;
use App\Http\Controllers\Api\Master\Pharmachy\ProductUnitType\ProductUnitTypeController;
use App\Http\Controllers\Api\Master\Pharmachy\ProductWarehouse\ProductWarehouseController;
use Illuminate\Support\Facades\Route;

Route::prefix('pharmacy')->group(function () {
    Route::apiResource('product-categories', ProductCategoryController::class);
    Route::apiResource('product-warehouses', ProductWarehouseController::class);
    Route::apiResource('product-unit-types', ProductUnitTypeController::class);
    Route::apiResource('product-racks', ProductRackController::class);
    Route::apiResource('products', ProductController::class);
});
