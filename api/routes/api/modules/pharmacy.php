<?php

use App\Http\Controllers\Api\Master\Pharmachy\Medicine\MedicineController;
use App\Http\Controllers\Api\Master\Pharmachy\MedicineBatch\MedicineBatchController;
use App\Http\Controllers\Api\Master\Pharmachy\MedicineCategory\MedicineCategoryController;
use App\Http\Controllers\Api\Master\Pharmachy\MedicineRack\MedicineRackController;
use App\Http\Controllers\Api\Master\Pharmachy\MedicineUnitType\MedicineUnitTypeController;
use App\Http\Controllers\Api\Master\Pharmachy\MedicineWarehouse\MedicineWarehouseController;
use Illuminate\Support\Facades\Route;

Route::prefix('pharmacy')->group(function () {
    Route::apiResource('medicine-categories', MedicineCategoryController::class);
    Route::apiResource('medicine-warehouses', MedicineWarehouseController::class);
    Route::apiResource('medicine-unit-types', MedicineUnitTypeController::class);
    Route::apiResource('medicines', MedicineController::class);

    Route::prefix('medicine-racks')->group(function () {
        Route::apiResource('/', MedicineRackController::class);
        Route::get('/unassigned-racks', [MedicineRackController::class, 'getUnassignedRacks']);
        Route::get('racks-by-warehouses/{medicineWarehouse}', [MedicineRackController::class, 'getByWarehouse']);
    });


    Route::prefix('medicine-batches')->group(function () {
        Route::get('/{medicine}', [MedicineBatchController::class, 'index']);
        Route::post('/', [MedicineBatchController::class, 'store']);
    });
});
