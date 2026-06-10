<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Domains\Pharmacy\Application\Services\PharmacyProcurementService;
use Domains\Pharmacy\Presentation\Requests\PharmacyPurchaseOrderRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyProcurementController extends Controller
{
    public function __construct(
        private PharmacyProcurementService $procurementService,
    ) {}

    /**
     * Create Purchase Order
     */
    public function createPurchaseOrder(PharmacyPurchaseOrderRequest $request): JsonResponse
    {
        try {
            $tenantId = auth()->user()->current_tenant_id;
            $po = $this->procurementService->createPurchaseOrder($tenantId, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Purchase Order dibuat berhasil',
                'data' => $po,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Add PO Item
     */
    public function addPOItem(int $poId, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'medicine_id' => 'required|integer|exists:pharmacy_medicines,id',
                'unit_id' => 'required|integer|exists:pharmacy_units,id',
                'quantity' => 'required|integer|min:1',
                'unit_price' => 'required|numeric|min:0',
            ]);

            $this->procurementService->addPOItem($poId, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Item PO berhasil ditambahkan',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Submit Purchase Order
     */
    public function submitPurchaseOrder(int $poId): JsonResponse
    {
        try {
            $this->procurementService->submitPurchaseOrder($poId, auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'Purchase Order berhasil disubmit untuk approval',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Approve Purchase Order
     */
    public function approvePurchaseOrder(int $poId): JsonResponse
    {
        try {
            $this->authorize('approve', 'pharmacy.po');

            $this->procurementService->approvePurchaseOrder($poId, auth()->id());

            return response()->json([
                'success' => true,
                'message' => 'Purchase Order berhasil diapprove',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Register Goods Receipt
     */
    public function registerGoodsReceipt(int $poId, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'notes' => 'nullable|string',
            ]);

            $tenantId = auth()->user()->current_tenant_id;
            $validated['received_by'] = auth()->id();

            $grn = $this->procurementService->registerGoodsReceipt($tenantId, $poId, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Goods Receipt Note dibuat berhasil',
                'data' => $grn,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Add GRN Item with Batch Tracking
     */
    public function addGRNItem(int $grnId, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'purchase_order_item_id' => 'required|integer|exists:pharmacy_purchase_order_items,id',
                'quantity_received' => 'required|integer|min:1',
                'batch_number' => 'required|string',
                'expiry_date' => 'required|date',
                'manufacture_date' => 'nullable|date',
                'unit_price' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            $this->procurementService->addGRNItem($grnId, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Item GRN berhasil ditambahkan',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Complete Goods Receipt
     */
    public function completeGoodsReceipt(int $grnId): JsonResponse
    {
        try {
            $this->procurementService->completeGoodsReceipt($grnId);

            return response()->json([
                'success' => true,
                'message' => 'Goods Receipt berhasil diselesaikan dan stok diperbarui',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Create Purchase Return
     */
    public function createPurchaseReturn(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'purchase_order_id' => 'required|integer|exists:pharmacy_purchase_orders,id',
                'supplier_id' => 'required|integer|exists:pharmacy_suppliers,id',
                'reason' => 'required|in:expired,damaged,wrong_item,quality_issue,other',
                'reason_description' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.medicine_batch_id' => 'required|integer|exists:pharmacy_medicine_batches,id',
                'items.*.quantity_returned' => 'required|integer|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
            ]);

            $tenantId = auth()->user()->current_tenant_id;
            $validated['created_by'] = auth()->id();

            $this->procurementService->createPurchaseReturn($tenantId, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Retur pembelian berhasil dibuat',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get Safety Alerts
     */
    public function getSafetyAlerts(): JsonResponse
    {
        try {
            $tenantId = auth()->user()->current_tenant_id;

            // Get active alerts grouped by severity
            $alerts = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySafetyAlert::where('tenant_id', $tenantId)
                ->where('status', 'active')
                ->orderBy('severity', 'desc')
                ->with(['medicineBatch.medicine'])
                ->get()
                ->groupBy('alert_type');

            return response()->json([
                'success' => true,
                'data' => $alerts,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Acknowledge Safety Alert
     */
    public function acknowledgeSafetyAlert(int $alertId): JsonResponse
    {
        try {
            $alert = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySafetyAlert::find($alertId);

            if (!$alert) {
                return response()->json([
                    'success' => false,
                    'message' => 'Alert tidak ditemukan',
                ], 404);
            }

            $alert->update([
                'status' => 'acknowledged',
                'acknowledged_by' => auth()->id(),
                'acknowledged_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Alert berhasil diacknowledge',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
