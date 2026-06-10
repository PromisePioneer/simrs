<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use Domains\Pharmacy\Application\Services\PharmacyProcurementEnhancedService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPurchaseOrder;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyGoodsReceipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyProcurementEnhancedController
{
    protected $service;

    public function __construct(PharmacyProcurementEnhancedService $service)
    {
        $this->service = $service;
    }

    /**
     * Create new purchase order
     * POST /api/v1/pharmacy/procurement/purchase-orders
     */
    public function createPO(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'supplier_id' => 'required|uuid|exists:pharmacy_suppliers,id',
            'warehouse_id' => 'required|uuid|exists:medicine_warehouses,id',
            'po_date' => 'nullable|date',
            'expected_delivery_date' => 'required|date|after:today',
            'items' => 'required|array|min:1',
            'items.*.medicine_id' => 'required|uuid|exists:medicines,id',
            'items.*.quantity_ordered' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string',
            'total_discount' => 'nullable|numeric|min:0',
            'total_tax' => 'nullable|numeric|min:0',
            'payment_terms' => 'nullable|string',
            'delivery_address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $result = $this->service->createPurchaseOrder(auth()->user()->tenant_id, $validated);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
            'data' => [
                'po_id' => $result['po_id'] ?? null,
                'po_number' => $result['po_number'] ?? null,
            ],
        ], $result['status'] === 'success' ? 201 : 422);
    }

    /**
     * List purchase orders
     * GET /api/v1/pharmacy/procurement/purchase-orders
     */
    public function listPOs(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $supplier = $request->query('supplier_id');
        $warehouse = $request->query('warehouse_id');

        $query = PharmacyPurchaseOrder::where('tenant_id', auth()->user()->tenant_id);

        if ($status) {
            $query->where('status', $status);
        }
        if ($supplier) {
            $query->where('supplier_id', $supplier);
        }
        if ($warehouse) {
            $query->where('warehouse_id', $warehouse);
        }

        $pos = $query->with(['items', 'supplier', 'warehouse'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $pos,
        ]);
    }

    /**
     * Get PO details
     * GET /api/v1/pharmacy/procurement/purchase-orders/{id}
     */
    public function getPO(string $id): JsonResponse
    {
        $po = PharmacyPurchaseOrder::with(['items', 'supplier', 'warehouse', 'goodsReceipts'])
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $po,
        ]);
    }

    /**
     * Submit PO for approval
     * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/submit
     */
    public function submitPO(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'notes' => 'nullable|string',
        ]);

        $result = $this->service->submitForApproval($id, $validated['notes'] ?? null);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
        ], $result['status'] === 'success' ? 200 : 422);
    }

    /**
     * Approve PO
     * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/approve
     */
    public function approvePO(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'approval_notes' => 'nullable|string',
            'approval_limit' => 'nullable|numeric|min:0',
        ]);

        $result = $this->service->approvePurchaseOrder(
            $id,
            $validated['approval_notes'] ?? null,
            $validated['approval_limit'] ?? null
        );

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
        ], $result['status'] === 'success' ? 200 : 422);
    }

    /**
     * Reject PO
     * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/reject
     */
    public function rejectPO(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $result = $this->service->rejectPurchaseOrder($id, $validated['rejection_reason']);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
        ], $result['status'] === 'success' ? 200 : 422);
    }

    /**
     * Confirm PO (send to supplier)
     * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/confirm
     */
    public function confirmPO(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'supplier_po_number' => 'nullable|string',
            'supplier_contact' => 'nullable|string',
        ]);

        $result = $this->service->confirmPurchaseOrder($id, $validated);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
        ], $result['status'] === 'success' ? 200 : 422);
    }

    /**
     * Cancel PO
     * POST /api/v1/pharmacy/procurement/purchase-orders/{id}/cancel
     */
    public function cancelPO(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:1000',
        ]);

        $result = $this->service->cancelPurchaseOrder($id, $validated['cancellation_reason']);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
        ], $result['status'] === 'success' ? 200 : 422);
    }

    /**
     * Update delivery status
     * PATCH /api/v1/pharmacy/procurement/purchase-orders/{id}/delivery-status
     */
    public function updateDeliveryStatus(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'delivery_status' => 'required|in:pending,in_transit,partial_delivered,delivered,cancelled',
            'actual_delivery_date' => 'nullable|date',
            'tracking_number' => 'nullable|string',
            'delivery_notes' => 'nullable|string',
        ]);

        $result = $this->service->updateDeliveryStatus($id, $validated['delivery_status'], $validated);

        return response()->json([
            'status' => $result['status'],
        ], $result['status'] === 'success' ? 200 : 422);
    }

    // ====================================================================
    // GOODS RECEIPT ENDPOINTS
    // ====================================================================

    /**
     * Create goods receipt from PO
     * POST /api/v1/pharmacy/procurement/goods-receipts
     */
    public function createGRN(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'po_id' => 'required|uuid|exists:pharmacy_purchase_orders,id',
            'receipt_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $result = $this->service->createGoodsReceipt($validated['po_id'], $validated);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
            'data' => [
                'grn_id' => $result['grn_id'] ?? null,
                'grn_number' => $result['grn_number'] ?? null,
            ],
        ], $result['status'] === 'success' ? 201 : 422);
    }

    /**
     * Register received items (batch, expiry, qty)
     * POST /api/v1/pharmacy/procurement/goods-receipts/{id}/items
     */
    public function registerReceivedItem(string $grnId, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'po_item_id' => 'required|uuid',
            'medicine_id' => 'required|uuid|exists:medicines,id',
            'batch_number' => 'required|string',
            'expiry_date' => 'required|date|after:today',
            'quantity_ordered' => 'required|integer|min:0',
            'quantity_received' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'condition_status' => 'nullable|in:good,damaged,incomplete,rejected',
            'notes' => 'nullable|string',
        ]);

        $result = $this->service->registerReceivedItem($grnId, $validated);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
            'data' => [
                'receipt_item_id' => $result['receipt_item_id'] ?? null,
            ],
        ], $result['status'] === 'success' ? 201 : 422);
    }

    /**
     * List goods receipts
     * GET /api/v1/pharmacy/procurement/goods-receipts
     */
    public function listGRNs(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $po = $request->query('po_id');

        $query = PharmacyGoodsReceipt::where('tenant_id', auth()->user()->tenant_id);

        if ($status) {
            $query->where('status', $status);
        }
        if ($po) {
            $query->where('po_id', $po);
        }

        $grns = $query->with(['items', 'purchaseOrder', 'supplier'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $grns,
        ]);
    }

    /**
     * Get GRN details
     * GET /api/v1/pharmacy/procurement/goods-receipts/{id}
     */
    public function getGRN(string $id): JsonResponse
    {
        $grn = PharmacyGoodsReceipt::with([
            'items',
            'purchaseOrder',
            'supplier',
            'qualityInspections',
            'variances'
        ])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $grn,
        ]);
    }

    /**
     * Finalize goods receipt
     * POST /api/v1/pharmacy/procurement/goods-receipts/{id}/finalize
     */
    public function finalizeGRN(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'quality_notes' => 'nullable|array',
        ]);

        $result = $this->service->finalizeGoodsReceipt($id, $validated['quality_notes'] ?? null);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
            'data' => [
                'total_received' => $result['total_received'] ?? null,
            ],
        ], $result['status'] === 'success' ? 200 : 422);
    }

    /**
     * Get variance report for GRN
     * GET /api/v1/pharmacy/procurement/goods-receipts/{id}/variances
     */
    public function getVariances(string $id): JsonResponse
    {
        $grn = PharmacyGoodsReceipt::with('variances')->findOrFail($id);

        $variances = $grn->variances()
            ->with('receiptItem')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_variances' => $variances->count(),
                'variances' => $variances,
            ],
        ]);
    }

    /**
     * Dashboard summary
     * GET /api/v1/pharmacy/procurement/dashboard
     */
    public function dashboard(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $poStats = [
            'draft_count' => PharmacyPurchaseOrder::where('tenant_id', $tenantId)->where('status', 'draft')->count(),
            'pending_approval' => PharmacyPurchaseOrder::where('tenant_id', $tenantId)->whereIn('status', ['submitted', 'reviewed'])->count(),
            'overdue_count' => PharmacyPurchaseOrder::where('tenant_id', $tenantId)->overdue()->count(),
            'confirmed_count' => PharmacyPurchaseOrder::where('tenant_id', $tenantId)->where('status', 'confirmed')->count(),
        ];

        $grnStats = [
            'in_progress' => PharmacyGoodsReceipt::where('tenant_id', $tenantId)->where('status', 'in_progress')->count(),
            'finalized' => PharmacyGoodsReceipt::where('tenant_id', $tenantId)->where('status', 'finalized')->count(),
            'with_variances' => PharmacyGoodsReceipt::where('tenant_id', $tenantId)->where('variance_items', '>', 0)->count(),
        ];

        $recentPOs = PharmacyPurchaseOrder::where('tenant_id', $tenantId)
            ->with(['supplier', 'warehouse'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $pendingGRNs = PharmacyGoodsReceipt::where('tenant_id', $tenantId)
            ->where('status', 'in_progress')
            ->with(['purchaseOrder', 'supplier'])
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'po_stats' => $poStats,
                'grn_stats' => $grnStats,
                'recent_pos' => $recentPOs,
                'pending_grns' => $pendingGRNs,
            ],
        ]);
    }
}
