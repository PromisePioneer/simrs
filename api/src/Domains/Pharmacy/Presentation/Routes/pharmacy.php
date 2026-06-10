<?php

declare(strict_types=1);

use Domains\Pharmacy\Presentation\Controllers\PharmacyProcurementController;
use Domains\Pharmacy\Presentation\Controllers\PharmacyPrescriptionAndSalesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'verified'])
    ->prefix('api/pharmacy')
    ->group(function () {
        
        // ============ PROCUREMENT ROUTES ============
        
        // Purchase Orders
        Route::post('/purchase-orders', [PharmacyProcurementController::class, 'createPurchaseOrder'])
            ->name('pharmacy.po.create');
        
        Route::post('/purchase-orders/{poId}/items', [PharmacyProcurementController::class, 'addPOItem'])
            ->name('pharmacy.po.items.add');
        
        Route::post('/purchase-orders/{poId}/submit', [PharmacyProcurementController::class, 'submitPurchaseOrder'])
            ->name('pharmacy.po.submit');
        
        Route::post('/purchase-orders/{poId}/approve', [PharmacyProcurementController::class, 'approvePurchaseOrder'])
            ->name('pharmacy.po.approve');
        
        // Goods Receipt Notes
        Route::post('/goods-receipt-notes', [PharmacyProcurementController::class, 'registerGoodsReceipt'])
            ->name('pharmacy.grn.create');
        
        Route::post('/goods-receipt-notes/{grnId}/items', [PharmacyProcurementController::class, 'addGRNItem'])
            ->name('pharmacy.grn.items.add');
        
        Route::post('/goods-receipt-notes/{grnId}/complete', [PharmacyProcurementController::class, 'completeGoodsReceipt'])
            ->name('pharmacy.grn.complete');
        
        // Purchase Returns
        Route::post('/purchase-returns', [PharmacyProcurementController::class, 'createPurchaseReturn'])
            ->name('pharmacy.return.create');
        
        // Safety Alerts
        Route::get('/safety-alerts', [PharmacyProcurementController::class, 'getSafetyAlerts'])
            ->name('pharmacy.alerts.list');
        
        Route::post('/safety-alerts/{alertId}/acknowledge', [PharmacyProcurementController::class, 'acknowledgeSafetyAlert'])
            ->name('pharmacy.alerts.acknowledge');
        
        
        // ============ PRESCRIPTION & DISPENSING ROUTES ============
        
        // Prescriptions
        Route::post('/prescriptions', [PharmacyPrescriptionAndSalesController::class, 'createPrescription'])
            ->name('pharmacy.prescription.create');
        
        Route::post('/prescriptions/{prescriptionId}/review', [PharmacyPrescriptionAndSalesController::class, 'reviewPrescription'])
            ->name('pharmacy.prescription.review');
        
        Route::post('/prescriptions/{prescriptionId}/approve', [PharmacyPrescriptionAndSalesController::class, 'approvePrescription'])
            ->name('pharmacy.prescription.approve');
        
        Route::get('/prescriptions', [PharmacyPrescriptionAndSalesController::class, 'getPrescriptions'])
            ->name('pharmacy.prescription.list');
        
        // Sales/Dispensing
        Route::post('/prescriptions/{prescriptionId}/sales', [PharmacyPrescriptionAndSalesController::class, 'createSaleFromPrescription'])
            ->name('pharmacy.sale.create');
        
        Route::post('/sales/{saleId}/complete', [PharmacyPrescriptionAndSalesController::class, 'completeSale'])
            ->name('pharmacy.sale.complete');
        
        Route::get('/sales', [PharmacyPrescriptionAndSalesController::class, 'getSales'])
            ->name('pharmacy.sale.list');
        
        Route::get('/sales/{saleId}', [PharmacyPrescriptionAndSalesController::class, 'getSaleDetails'])
            ->name('pharmacy.sale.detail');
        
        // Patient Returns
        Route::post('/patient-returns', [PharmacyPrescriptionAndSalesController::class, 'createPatientReturn'])
            ->name('pharmacy.patient-return.create');
        
        // Etiket (Labels)
        Route::get('/prescription-items/{itemId}/etiket', [PharmacyPrescriptionAndSalesController::class, 'printEtiket'])
            ->name('pharmacy.etiket.print');
    });
