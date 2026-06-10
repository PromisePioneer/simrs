<?php

use Illuminate\Support\Facades\Route;
use Domains\Pharmacy\Presentation\Controllers\PharmacyStockTransferController;
use Domains\Pharmacy\Presentation\Controllers\PharmacyStockOpnameController;
use Domains\Pharmacy\Presentation\Controllers\PharmacyDefectaController;
use Domains\Pharmacy\Presentation\Controllers\PharmacyFinancialReportController;
use Domains\Pharmacy\Presentation\Controllers\PharmacyIntegrationController;

/**
 * Pharmacy Phase 2 - Advanced Features Routes
 * 
 * These routes are for Phase 2 advanced features including:
 * - Stock transfers (mutasi stok)
 * - Stock opnames (stok opname)
 * - Defecta reports (laporan defecta)
 * - Financial reports (laporan keuangan)
 * - Government integration (integrasi SatuSehat & DINKES/BPOM)
 */

Route::middleware(['auth:api', 'tenant'])->prefix('api/v1/pharmacy')->group(function () {
    
    // ====================================================================
    // STOCK TRANSFER ENDPOINTS (Mutasi/Transfer Stok)
    // ====================================================================
    Route::controller(PharmacyStockTransferController::class)->prefix('transfers')->group(function () {
        // Create stock transfer
        Route::post('/', 'create')
            ->name('pharmacy.transfers.create')
            ->middleware('permission:pharmacy.transfers.create');
        
        // List stock transfers with filters
        Route::get('/', 'index')
            ->name('pharmacy.transfers.index')
            ->middleware('permission:pharmacy.transfers.view');
        
        // Get stock transfer details
        Route::get('/{id}', 'show')
            ->name('pharmacy.transfers.show')
            ->middleware('permission:pharmacy.transfers.view');
        
        // Approve stock transfer
        Route::post('/{id}/approve', 'approve')
            ->name('pharmacy.transfers.approve')
            ->middleware('permission:pharmacy.transfers.approve');
        
        // Send stock transfer
        Route::post('/{id}/send', 'send')
            ->name('pharmacy.transfers.send')
            ->middleware('permission:pharmacy.transfers.send');
        
        // Receive stock transfer
        Route::post('/{id}/receive', 'receive')
            ->name('pharmacy.transfers.receive')
            ->middleware('permission:pharmacy.transfers.receive');
        
        // Cancel stock transfer
        Route::post('/{id}/cancel', 'cancel')
            ->name('pharmacy.transfers.cancel')
            ->middleware('permission:pharmacy.transfers.cancel');
        
        // Delete stock transfer (draft only)
        Route::delete('/{id}', 'destroy')
            ->name('pharmacy.transfers.destroy')
            ->middleware('permission:pharmacy.transfers.delete');
    });

    // ====================================================================
    // STOCK OPNAME ENDPOINTS (Stok Opname)
    // ====================================================================
    Route::controller(PharmacyStockOpnameController::class)->prefix('opnames')->group(function () {
        // Create stock opname session
        Route::post('/', 'create')
            ->name('pharmacy.opnames.create')
            ->middleware('permission:pharmacy.opnames.create');
        
        // List stock opnames with filters
        Route::get('/', 'index')
            ->name('pharmacy.opnames.index')
            ->middleware('permission:pharmacy.opnames.view');
        
        // Get stock opname details
        Route::get('/{id}', 'show')
            ->name('pharmacy.opnames.show')
            ->middleware('permission:pharmacy.opnames.view');
        
        // Add item to opname
        Route::post('/{id}/items', 'addItem')
            ->name('pharmacy.opnames.add-item')
            ->middleware('permission:pharmacy.opnames.edit');
        
        // Finalize opname
        Route::post('/{id}/finalize', 'finalize')
            ->name('pharmacy.opnames.finalize')
            ->middleware('permission:pharmacy.opnames.finalize');
        
        // Reconcile opname - apply variances to system
        Route::post('/{id}/reconcile', 'reconcile')
            ->name('pharmacy.opnames.reconcile')
            ->middleware('permission:pharmacy.opnames.reconcile');
        
        // Get variance report
        Route::get('/{id}/variance-report', 'varianceReport')
            ->name('pharmacy.opnames.variance-report')
            ->middleware('permission:pharmacy.opnames.view');
        
        // Delete opname (draft only)
        Route::delete('/{id}', 'destroy')
            ->name('pharmacy.opnames.destroy')
            ->middleware('permission:pharmacy.opnames.delete');
    });

    // ====================================================================
    // DEFECTA REPORT ENDPOINTS (Laporan Defecta)
    // ====================================================================
    Route::controller(PharmacyDefectaController::class)->prefix('defecta')->group(function () {
        // Generate defecta report for all medicines
        Route::post('/generate', 'generate')
            ->name('pharmacy.defecta.generate')
            ->middleware('permission:pharmacy.defecta.generate');
        
        // List defecta items by urgency
        Route::get('/', 'index')
            ->name('pharmacy.defecta.index')
            ->middleware('permission:pharmacy.defecta.view');
        
        // Get only urgent defecta items
        Route::get('/urgent', 'urgent')
            ->name('pharmacy.defecta.urgent')
            ->middleware('permission:pharmacy.defecta.view');
        
        // Mark defecta as ordered (create PO from defecta)
        Route::post('/{id}/mark-ordered', 'markOrdered')
            ->name('pharmacy.defecta.mark-ordered')
            ->middleware('permission:pharmacy.defecta.edit');
        
        // Get defecta report with summary
        Route::get('/report', 'report')
            ->name('pharmacy.defecta.report')
            ->middleware('permission:pharmacy.defecta.view');
    });

    // ====================================================================
    // FINANCIAL REPORT ENDPOINTS (Laporan Keuangan)
    // ====================================================================
    Route::prefix('reports')->group(function () {
        Route::controller(PharmacyFinancialReportController::class)->prefix('financial')->group(function () {
            // Generate daily financial report
            Route::get('/daily', 'daily')
                ->name('pharmacy.reports.financial.daily')
                ->middleware('permission:pharmacy.reports.view');
            
            // Generate weekly financial report
            Route::get('/weekly', 'weekly')
                ->name('pharmacy.reports.financial.weekly')
                ->middleware('permission:pharmacy.reports.view');
            
            // Generate monthly financial report
            Route::get('/monthly', 'monthly')
                ->name('pharmacy.reports.financial.monthly')
                ->middleware('permission:pharmacy.reports.view');
            
            // Get revenue trend
            Route::get('/revenue-trend', 'revenueTrend')
                ->name('pharmacy.reports.revenue-trend')
                ->middleware('permission:pharmacy.reports.view');
            
            // Get profit analysis
            Route::get('/profit-analysis', 'profitAnalysis')
                ->name('pharmacy.reports.profit-analysis')
                ->middleware('permission:pharmacy.reports.view');
            
            // Get cost analysis
            Route::get('/cost-analysis', 'costAnalysis')
                ->name('pharmacy.reports.cost-analysis')
                ->middleware('permission:pharmacy.reports.view');
            
            // Get margin analysis by medicine
            Route::get('/margin-by-medicine', 'marginByMedicine')
                ->name('pharmacy.reports.margin-by-medicine')
                ->middleware('permission:pharmacy.reports.view');
        });
    });

    // ====================================================================
    // INTEGRATION ENDPOINTS (SatuSehat & Government Compliance)
    // ====================================================================
    Route::controller(PharmacyIntegrationController::class)->prefix('integration')->group(function () {
        // Sync medicines to SatuSehat KFA database
        Route::post('/sync-medicines', 'syncMedicines')
            ->name('pharmacy.integration.sync-medicines')
            ->middleware('permission:pharmacy.integration.sync');
        
        // Validate KFA compliance for a medicine
        Route::post('/validate-kfa', 'validateKFA')
            ->name('pharmacy.integration.validate-kfa')
            ->middleware('permission:pharmacy.integration.validate');
        
        // Sync usage report to SatuSehat
        Route::post('/sync-usage-report', 'syncUsageReport')
            ->name('pharmacy.integration.sync-usage-report')
            ->middleware('permission:pharmacy.integration.sync');
        
        // Sync narcotics report to government (DINKES/BPOM)
        Route::post('/sync-narcotics-report', 'syncNarcoticsReport')
            ->name('pharmacy.integration.sync-narcotics-report')
            ->middleware('permission:pharmacy.integration.sync');
        
        // Get sync logs
        Route::get('/sync-logs', 'syncLogs')
            ->name('pharmacy.integration.sync-logs')
            ->middleware('permission:pharmacy.integration.view');
        
        // Get KFA mappings
        Route::get('/kfa-mapping', 'kfaMappings')
            ->name('pharmacy.integration.kfa-mapping')
            ->middleware('permission:pharmacy.integration.view');
        
        // Get integration status/health check
        Route::get('/status', 'status')
            ->name('pharmacy.integration.status')
            ->middleware('permission:pharmacy.integration.view');
    });

});

/**
 * Route Summary
 * 
 * Stock Transfer Routes: 8
 * - POST   /pharmacy/transfers
 * - GET    /pharmacy/transfers
 * - GET    /pharmacy/transfers/{id}
 * - POST   /pharmacy/transfers/{id}/approve
 * - POST   /pharmacy/transfers/{id}/send
 * - POST   /pharmacy/transfers/{id}/receive
 * - POST   /pharmacy/transfers/{id}/cancel
 * - DELETE /pharmacy/transfers/{id}
 * 
 * Stock Opname Routes: 8
 * - POST   /pharmacy/opnames
 * - GET    /pharmacy/opnames
 * - GET    /pharmacy/opnames/{id}
 * - POST   /pharmacy/opnames/{id}/items
 * - POST   /pharmacy/opnames/{id}/finalize
 * - POST   /pharmacy/opnames/{id}/reconcile
 * - GET    /pharmacy/opnames/{id}/variance-report
 * - DELETE /pharmacy/opnames/{id}
 * 
 * Defecta Report Routes: 5
 * - POST   /pharmacy/defecta/generate
 * - GET    /pharmacy/defecta
 * - GET    /pharmacy/defecta/urgent
 * - POST   /pharmacy/defecta/{id}/mark-ordered
 * - GET    /pharmacy/defecta/report
 * 
 * Financial Report Routes: 7
 * - GET    /pharmacy/reports/financial/daily
 * - GET    /pharmacy/reports/financial/weekly
 * - GET    /pharmacy/reports/financial/monthly
 * - GET    /pharmacy/reports/financial/revenue-trend
 * - GET    /pharmacy/reports/financial/profit-analysis
 * - GET    /pharmacy/reports/financial/cost-analysis
 * - GET    /pharmacy/reports/financial/margin-by-medicine
 * 
 * Integration Routes: 7
 * - POST   /pharmacy/integration/sync-medicines
 * - POST   /pharmacy/integration/validate-kfa
 * - POST   /pharmacy/integration/sync-usage-report
 * - POST   /pharmacy/integration/sync-narcotics-report
 * - GET    /pharmacy/integration/sync-logs
 * - GET    /pharmacy/integration/kfa-mapping
 * - GET    /pharmacy/integration/status
 * 
 * TOTAL: 35 routes
 */
