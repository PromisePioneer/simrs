<?php

use Illuminate\Support\Facades\Route;
use Domains\Pharmacy\Presentation\Controllers\PharmacyProcurementEnhancedController;

/**
 * Pharmacy Phase 3A - Procurement & Receiving Enhanced Routes
 * 
 * Features:
 * - Purchase Order workflow (draft → submitted → reviewed → approved → confirmed → received)
 * - Goods Receipt Note (GRN) automation
 * - Quality inspection & variance tracking
 * - Supplier performance metrics
 * 
 * @version 3.0
 */

Route::middleware(['auth:api', 'tenant'])->prefix('api/v1/pharmacy/procurement')->group(function () {
    
    // ====================================================================
    // PURCHASE ORDER ENDPOINTS
    // ====================================================================
    
    Route::controller(PharmacyProcurementEnhancedController::class)->prefix('purchase-orders')->group(function () {
        /**
         * Create new purchase order
         * POST /api/v1/pharmacy/procurement/purchase-orders
         * 
         * Payload:
         * {
         *   "supplier_id": "uuid",
         *   "warehouse_id": "uuid",
         *   "expected_delivery_date": "2026-06-20",
         *   "items": [
         *     {
         *       "medicine_id": "uuid",
         *       "quantity_ordered": 100,
         *       "unit_price": 50000,
         *       "notes": "optional"
         *     }
         *   ],
         *   "payment_terms": "net30",
         *   "delivery_address": "Apotek Utama",
         *   "notes": "optional"
         * }
         */
        Route::post('/', 'createPO')
            ->name('pharmacy.procurement.po.create')
            ->middleware('permission:pharmacy.procurement.po.create');
        
        /**
         * List purchase orders with filters
         * GET /api/v1/pharmacy/procurement/purchase-orders?status=draft&supplier_id=uuid&warehouse_id=uuid
         */
        Route::get('/', 'listPOs')
            ->name('pharmacy.procurement.po.list')
            ->middleware('permission:pharmacy.procurement.po.view');
        
        /**
         * Get PO details with items and receipts
         * GET /api/v1/pharmacy/procurement/purchase-orders/{id}
         */
        Route::get('/{id}', 'getPO')
            ->name('pharmacy.procurement.po.show')
            ->middleware('permission:pharmacy.procurement.po.view');
        
        /**
         * Submit PO for approval
         * Status transition: draft → submitted
         * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/submit
         */
        Route::post('/{id}/submit', 'submitPO')
            ->name('pharmacy.procurement.po.submit')
            ->middleware('permission:pharmacy.procurement.po.submit');
        
        /**
         * Approve PO
         * Status transition: submitted → approved
         * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/approve
         * 
         * Payload:
         * {
         *   "approval_notes": "Approved by budget committee",
         *   "approval_limit": 50000000
         * }
         */
        Route::post('/{id}/approve', 'approvePO')
            ->name('pharmacy.procurement.po.approve')
            ->middleware('permission:pharmacy.procurement.po.approve');
        
        /**
         * Reject PO
         * Status transition: submitted/reviewed → rejected
         * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/reject
         */
        Route::post('/{id}/reject', 'rejectPO')
            ->name('pharmacy.procurement.po.reject')
            ->middleware('permission:pharmacy.procurement.po.reject');
        
        /**
         * Confirm PO (send to supplier)
         * Status transition: approved → confirmed
         * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/confirm
         * 
         * Payload:
         * {
         *   "supplier_po_number": "SP-2026-001",
         *   "supplier_contact": "contact@supplier.com"
         * }
         */
        Route::post('/{id}/confirm', 'confirmPO')
            ->name('pharmacy.procurement.po.confirm')
            ->middleware('permission:pharmacy.procurement.po.confirm');
        
        /**
         * Cancel PO
         * Status transition: draft/confirmed → cancelled
         * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/cancel
         */
        Route::post('/{id}/cancel', 'cancelPO')
            ->name('pharmacy.procurement.po.cancel')
            ->middleware('permission:pharmacy.procurement.po.cancel');
        
        /**
         * Update delivery status
         * PATCH /api/v1/pharmacy/procurement/purchase-orders/{id}/delivery-status
         * 
         * Payload:
         * {
         *   "delivery_status": "in_transit",
         *   "tracking_number": "TRACK123456",
         *   "actual_delivery_date": "2026-06-18",
         *   "delivery_notes": "On time delivery"
         * }
         */
        Route::patch('/{id}/delivery-status', 'updateDeliveryStatus')
            ->name('pharmacy.procurement.po.delivery-status')
            ->middleware('permission:pharmacy.procurement.po.update');
    });

    // ====================================================================
    // GOODS RECEIPT NOTE (GRN) ENDPOINTS
    // ====================================================================
    
    Route::controller(PharmacyProcurementEnhancedController::class)->prefix('goods-receipts')->group(function () {
        /**
         * Create goods receipt from PO
         * POST /api/v1/pharmacy/procurement/goods-receipts
         * 
         * Payload:
         * {
         *   "po_id": "uuid",
         *   "receipt_date": "2026-06-15",
         *   "notes": "Received at warehouse"
         * }
         */
        Route::post('/', 'createGRN')
            ->name('pharmacy.procurement.grn.create')
            ->middleware('permission:pharmacy.procurement.grn.create');
        
        /**
         * List goods receipts
         * GET /api/v1/pharmacy/procurement/goods-receipts?status=in_progress&po_id=uuid
         */
        Route::get('/', 'listGRNs')
            ->name('pharmacy.procurement.grn.list')
            ->middleware('permission:pharmacy.procurement.grn.view');
        
        /**
         * Get GRN details with items, inspections, variances
         * GET /api/v1/pharmacy/procurement/goods-receipts/{id}
         */
        Route::get('/{id}', 'getGRN')
            ->name('pharmacy.procurement.grn.show')
            ->middleware('permission:pharmacy.procurement.grn.view');
        
        /**
         * Register received item (batch number, expiry date, quantity)
         * POST /api/v1/pharmacy/procurement/goods-receipts/{id}/items
         * 
         * Payload:
         * {
         *   "po_item_id": "uuid",
         *   "medicine_id": "uuid",
         *   "batch_number": "B2026001",
         *   "expiry_date": "2027-06-10",
         *   "quantity_ordered": 100,
         *   "quantity_received": 100,
         *   "unit_price": 50000,
         *   "condition_status": "good",
         *   "notes": "All items in good condition"
         * }
         */
        Route::post('/{id}/items', 'registerReceivedItem')
            ->name('pharmacy.procurement.grn.add-item')
            ->middleware('permission:pharmacy.procurement.grn.edit');
        
        /**
         * Finalize goods receipt
         * Status transition: in_progress → finalized
         * POST /api/v1/pharmacy/procurement/goods-receipts/{id}/finalize
         * 
         * Payload:
         * {
         *   "quality_notes": {
         *     "inspection_type": "full_inspection",
         *     "findings": "All items passed quality check"
         *   }
         * }
         */
        Route::post('/{id}/finalize', 'finalizeGRN')
            ->name('pharmacy.procurement.grn.finalize')
            ->middleware('permission:pharmacy.procurement.grn.finalize');
        
        /**
         * Get variance report
         * GET /api/v1/pharmacy/procurement/goods-receipts/{id}/variances
         * 
         * Returns:
         * {
         *   "total_variances": 2,
         *   "variances": [
         *     {
         *       "receipt_item_id": "uuid",
         *       "variance_type": "under_received",
         *       "quantity_ordered": 100,
         *       "quantity_received": 98,
         *       "variance_quantity": -2,
         *       "status": "flagged"
         *     }
         *   ]
         * }
         */
        Route::get('/{id}/variances', 'getVariances')
            ->name('pharmacy.procurement.grn.variances')
            ->middleware('permission:pharmacy.procurement.grn.view');
    });

    // ====================================================================
    // DASHBOARD & REPORTING
    // ====================================================================
    
    /**
     * Procurement dashboard summary
     * GET /api/v1/pharmacy/procurement/dashboard
     * 
     * Returns:
     * {
     *   "po_stats": {
     *     "draft_count": 3,
     *     "pending_approval": 2,
     *     "overdue_count": 1,
     *     "confirmed_count": 5
     *   },
     *   "grn_stats": {
     *     "in_progress": 2,
     *     "finalized": 10,
     *     "with_variances": 1
     *   },
     *   "recent_pos": [...],
     *   "pending_grns": [...]
     * }
     */
    Route::get('/dashboard', [PharmacyProcurementEnhancedController::class, 'dashboard'])
        ->name('pharmacy.procurement.dashboard')
        ->middleware('permission:pharmacy.procurement.view');

});

/**
 * ROUTE SUMMARY
 * 
 * Purchase Order Routes (9):
 * - POST   /pharmacy/procurement/purchase-orders
 * - GET    /pharmacy/procurement/purchase-orders
 * - GET    /pharmacy/procurement/purchase-orders/{id}
 * - POST   /pharmacy/procurement/purchase-orders/{id}/submit
 * - POST   /pharmacy/procurement/purchase-orders/{id}/approve
 * - POST   /pharmacy/procurement/purchase-orders/{id}/reject
 * - POST   /pharmacy/procurement/purchase-orders/{id}/confirm
 * - POST   /pharmacy/procurement/purchase-orders/{id}/cancel
 * - PATCH  /pharmacy/procurement/purchase-orders/{id}/delivery-status
 * 
 * Goods Receipt Routes (7):
 * - POST   /pharmacy/procurement/goods-receipts
 * - GET    /pharmacy/procurement/goods-receipts
 * - GET    /pharmacy/procurement/goods-receipts/{id}
 * - POST   /pharmacy/procurement/goods-receipts/{id}/items
 * - POST   /pharmacy/procurement/goods-receipts/{id}/finalize
 * - GET    /pharmacy/procurement/goods-receipts/{id}/variances
 * 
 * Dashboard (1):
 * - GET    /pharmacy/procurement/dashboard
 * 
 * TOTAL: 17 routes
 * 
 * PERMISSIONS REQUIRED:
 * - pharmacy.procurement.po.create
 * - pharmacy.procurement.po.view
 * - pharmacy.procurement.po.submit
 * - pharmacy.procurement.po.approve
 * - pharmacy.procurement.po.reject
 * - pharmacy.procurement.po.confirm
 * - pharmacy.procurement.po.cancel
 * - pharmacy.procurement.po.update
 * - pharmacy.procurement.grn.create
 * - pharmacy.procurement.grn.view
 * - pharmacy.procurement.grn.edit
 * - pharmacy.procurement.grn.finalize
 * - pharmacy.procurement.view (dashboard)
 */
