<?php

use Domains\Pharmacy\Presentation\Controllers\MedicineBatchController;
use Domains\Pharmacy\Presentation\Controllers\MedicineBatchStockController;
use Domains\Pharmacy\Presentation\Controllers\MedicineCategoryController;
use Domains\Pharmacy\Presentation\Controllers\MedicineController;
use Domains\Pharmacy\Presentation\Controllers\MedicineRackController;
use Domains\Pharmacy\Presentation\Controllers\MedicineStockMovementController;
use Domains\Pharmacy\Presentation\Controllers\MedicineUnitTypeController;
use Domains\Pharmacy\Presentation\Controllers\MedicineWarehouseController;
use Illuminate\Support\Facades\Route;


// ── Pro only ──────────────────────────────────────────────────────────────────
Route::middleware(['module:Electronic Medical Record'])->group(function () {
    Route::prefix('pharmacy')->group(function () {
        Route::apiResource('medicine-categories', MedicineCategoryController::class);
        Route::apiResource('medicine-warehouses', MedicineWarehouseController::class);
        Route::apiResource('medicine-unit-types', MedicineUnitTypeController::class);

        Route::get('/medicines/ready-stocks', [MedicineController::class, 'getReadyStocksMedicine']);
        Route::get('/medicines/search-with-stock', [MedicineController::class, 'searchWithStock']);
        Route::apiResource('/medicines', MedicineController::class);

        Route::prefix('medicine-racks')->group(function () {
            Route::apiResource('/', MedicineRackController::class);
            Route::get('/unassigned-racks', [MedicineRackController::class, 'getUnassignedRacks']);
            Route::get('racks-by-warehouses/{medicineWarehouse}', [MedicineRackController::class, 'getByWarehouse']);
        });

        Route::prefix('medicine-batches')->group(function () {
            Route::get('/{medicineBatch}', [MedicineBatchController::class, 'show']);
            Route::get('/medicine/{medicine}', [MedicineBatchController::class, 'index']);
            Route::post('/', [MedicineBatchController::class, 'store']);
            Route::put('/{medicineBatch}', [MedicineBatchController::class, 'update']);
            Route::delete('/{medicineBatch}', [MedicineBatchController::class, 'destroy']);
        });

        Route::prefix('medicine-batch-stocks')->group(function () {
            Route::get('/', [MedicineBatchStockController::class, 'index']);
            Route::post('/', [MedicineBatchStockController::class, 'store']);
            Route::get('/{medicineBatchStock}', [MedicineBatchStockController::class, 'show']);
        });

        Route::prefix('stocks')->group(function () {
            Route::get('/movements', [MedicineStockMovementController::class, 'index']);
        });
    });
});
