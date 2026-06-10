<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPurchaseOrder;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPurchaseOrderItem;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyGoodsReceipt;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyReceiptItem;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Illuminate\Support\Str;
use Carbon\Carbon;

/**
 * PharmacyProcurementEnhancedService
 * 
 * Layanan manajemen pengadaan obat dengan workflow approval multi-step
 * - Purchase Order creation & management
 * - PO approval workflow (draft → submitted → reviewed → approved → confirmed)
 * - Delivery tracking
 * - Goods Receipt (GRN) automation
 * 
 * @author Pharmacy Team
 * @version 2.0
 */
class PharmacyProcurementEnhancedService
{
    /**
     * Create purchase order
     * Status: draft (belum diajukan)
     */
    public function createPurchaseOrder(
        string $tenantId,
        array $data
    ): array {
        try {
            $poNumber = $this->generatePONumber($tenantId);
            
            $po = PharmacyPurchaseOrder::create([
                'id' => Str::uuid(),
                'tenant_id' => $tenantId,
                'po_number' => $poNumber,
                'supplier_id' => $data['supplier_id'],
                'warehouse_id' => $data['warehouse_id'],
                'po_date' => $data['po_date'] ?? now()->format('Y-m-d'),
                'expected_delivery_date' => $data['expected_delivery_date'],
                'status' => 'draft',
                'total_amount' => 0,
                'total_discount' => $data['total_discount'] ?? 0,
                'total_tax' => $data['total_tax'] ?? 0,
                'grand_total' => 0,
                'payment_terms' => $data['payment_terms'] ?? 'net30',
                'delivery_address' => $data['delivery_address'],
                'notes' => $data['notes'] ?? null,
                'created_by' => auth()->user()->id,
                'created_at' => now(),
            ]);

            // Add line items
            if (isset($data['items']) && is_array($data['items'])) {
                foreach ($data['items'] as $item) {
                    $this->addPurchaseOrderItem($po->id, $item);
                }
            }

            // Recalculate totals
            $this->recalculatePOTotals($po->id);

            return [
                'status' => 'success',
                'message' => 'Purchase order created successfully',
                'po_id' => $po->id,
                'po_number' => $poNumber,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Add item to purchase order
     */
    public function addPurchaseOrderItem(
        string $poId,
        array $itemData
    ): array {
        try {
            $po = PharmacyPurchaseOrder::findOrFail($poId);

            if ($po->status !== 'draft') {
                return [
                    'status' => 'error',
                    'message' => 'Cannot add items to non-draft PO',
                ];
            }

            $item = PharmacyPurchaseOrderItem::create([
                'id' => Str::uuid(),
                'po_id' => $poId,
                'medicine_id' => $itemData['medicine_id'],
                'quantity_ordered' => $itemData['quantity_ordered'],
                'unit_price' => $itemData['unit_price'],
                'line_total' => $itemData['quantity_ordered'] * $itemData['unit_price'],
                'notes' => $itemData['notes'] ?? null,
                'created_at' => now(),
            ]);

            $this->recalculatePOTotals($poId);

            return [
                'status' => 'success',
                'item_id' => $item->id,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Submit PO for approval
     * Status: draft → submitted
     */
    public function submitForApproval(
        string $poId,
        ?string $notes = null
    ): array {
        try {
            $po = PharmacyPurchaseOrder::findOrFail($poId);

            if ($po->status !== 'draft') {
                return [
                    'status' => 'error',
                    'message' => 'Only draft PO can be submitted',
                ];
            }

            if ($po->items()->count() === 0) {
                return [
                    'status' => 'error',
                    'message' => 'PO must have at least 1 item',
                ];
            }

            $po->update([
                'status' => 'submitted',
                'submitted_at' => now(),
                'submitted_by' => auth()->user()->id,
                'submission_notes' => $notes,
            ]);

            // Create notification for approver
            $this->notifyApprover($po);

            return [
                'status' => 'success',
                'message' => 'PO submitted for approval',
                'po_status' => 'submitted',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Approve purchase order
     * Status: submitted → approved
     */
    public function approvePurchaseOrder(
        string $poId,
        ?string $approvalNotes = null,
        ?int $approvalLimit = null
    ): array {
        try {
            $po = PharmacyPurchaseOrder::findOrFail($poId);

            if ($po->status !== 'submitted') {
                return [
                    'status' => 'error',
                    'message' => 'Only submitted PO can be approved',
                ];
            }

            // Check approval limit
            if ($approvalLimit && $po->grand_total > $approvalLimit) {
                return [
                    'status' => 'error',
                    'message' => 'PO amount exceeds your approval limit',
                    'po_amount' => $po->grand_total,
                    'approval_limit' => $approvalLimit,
                ];
            }

            $po->update([
                'status' => 'approved',
                'approved_at' => now(),
                'approved_by' => auth()->user()->id,
                'approval_notes' => $approvalNotes,
            ]);

            return [
                'status' => 'success',
                'message' => 'PO approved successfully',
                'po_status' => 'approved',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Confirm PO (send to supplier)
     * Status: approved → confirmed
     */
    public function confirmPurchaseOrder(
        string $poId,
        array $supplierData = []
    ): array {
        try {
            $po = PharmacyPurchaseOrder::findOrFail($poId);

            if ($po->status !== 'approved') {
                return [
                    'status' => 'error',
                    'message' => 'Only approved PO can be confirmed',
                ];
            }

            $po->update([
                'status' => 'confirmed',
                'confirmed_at' => now(),
                'confirmed_by' => auth()->user()->id,
                'supplier_po_number' => $supplierData['supplier_po_number'] ?? null,
                'supplier_contact' => $supplierData['supplier_contact'] ?? null,
            ]);

            // Log to external system if configured
            $this->logSupplierNotification($po, 'PO_CONFIRMED');

            return [
                'status' => 'success',
                'message' => 'PO confirmed and sent to supplier',
                'po_status' => 'confirmed',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Update delivery status
     */
    public function updateDeliveryStatus(
        string $poId,
        string $deliveryStatus,
        ?array $deliveryData = null
    ): array {
        try {
            $po = PharmacyPurchaseOrder::findOrFail($poId);

            $updateData = [
                'delivery_status' => $deliveryStatus,
                'delivery_status_updated_at' => now(),
            ];

            if ($deliveryData) {
                if (isset($deliveryData['actual_delivery_date'])) {
                    $updateData['actual_delivery_date'] = $deliveryData['actual_delivery_date'];
                }
                if (isset($deliveryData['delivery_notes'])) {
                    $updateData['delivery_notes'] = $deliveryData['delivery_notes'];
                }
                if (isset($deliveryData['tracking_number'])) {
                    $updateData['tracking_number'] = $deliveryData['tracking_number'];
                }
            }

            $po->update($updateData);

            return [
                'status' => 'success',
                'delivery_status' => $deliveryStatus,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Reject PO
     * Status: submitted/approved → rejected
     */
    public function rejectPurchaseOrder(
        string $poId,
        string $rejectionReason
    ): array {
        try {
            $po = PharmacyPurchaseOrder::findOrFail($poId);

            if (!in_array($po->status, ['submitted', 'approved'])) {
                return [
                    'status' => 'error',
                    'message' => 'Only submitted or approved PO can be rejected',
                ];
            }

            $po->update([
                'status' => 'rejected',
                'rejected_at' => now(),
                'rejected_by' => auth()->user()->id,
                'rejection_reason' => $rejectionReason,
            ]);

            return [
                'status' => 'success',
                'message' => 'PO rejected',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Cancel PO
     * Status: draft/confirmed → cancelled
     */
    public function cancelPurchaseOrder(
        string $poId,
        string $cancellationReason
    ): array {
        try {
            $po = PharmacyPurchaseOrder::findOrFail($poId);

            if (!in_array($po->status, ['draft', 'confirmed'])) {
                return [
                    'status' => 'error',
                    'message' => 'Only draft or confirmed PO can be cancelled',
                ];
            }

            $po->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancelled_by' => auth()->user()->id,
                'cancellation_reason' => $cancellationReason,
            ]);

            // Notify supplier if already confirmed
            if ($po->status === 'confirmed') {
                $this->logSupplierNotification($po, 'PO_CANCELLED');
            }

            return [
                'status' => 'success',
                'message' => 'PO cancelled',
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Create Goods Receipt (GRN) from PO
     */
    public function createGoodsReceipt(
        string $poId,
        array $receiptData
    ): array {
        try {
            $po = PharmacyPurchaseOrder::findOrFail($poId);

            if ($po->status !== 'confirmed') {
                return [
                    'status' => 'error',
                    'message' => 'PO must be confirmed before creating receipt',
                ];
            }

            $grnNumber = $this->generateGRNNumber($po->tenant_id);

            $grn = PharmacyGoodsReceipt::create([
                'id' => Str::uuid(),
                'tenant_id' => $po->tenant_id,
                'grn_number' => $grnNumber,
                'po_id' => $poId,
                'supplier_id' => $po->supplier_id,
                'warehouse_id' => $po->warehouse_id,
                'receipt_date' => $receiptData['receipt_date'] ?? now()->format('Y-m-d'),
                'received_by_user_id' => auth()->user()->id,
                'total_items' => 0,
                'total_received' => 0,
                'variance_items' => 0,
                'status' => 'in_progress',
                'notes' => $receiptData['notes'] ?? null,
                'received_at' => now(),
            ]);

            return [
                'status' => 'success',
                'grn_id' => $grn->id,
                'grn_number' => $grnNumber,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Register received items (batch number, expiry date, etc)
     */
    public function registerReceivedItem(
        string $grnId,
        array $itemData
    ): array {
        try {
            $grn = PharmacyGoodsReceipt::findOrFail($grnId);

            if ($grn->status !== 'in_progress') {
                return [
                    'status' => 'error',
                    'message' => 'GRN is not in progress',
                ];
            }

            $receiptItem = PharmacyReceiptItem::create([
                'id' => Str::uuid(),
                'grn_id' => $grnId,
                'po_item_id' => $itemData['po_item_id'],
                'medicine_id' => $itemData['medicine_id'],
                'batch_number' => $itemData['batch_number'],
                'expiry_date' => $itemData['expiry_date'],
                'quantity_received' => $itemData['quantity_received'],
                'quantity_ordered' => $itemData['quantity_ordered'] ?? 0,
                'unit_price' => $itemData['unit_price'],
                'line_total' => $itemData['quantity_received'] * $itemData['unit_price'],
                'variance' => ($itemData['quantity_received'] ?? 0) - ($itemData['quantity_ordered'] ?? 0),
                'condition_status' => $itemData['condition_status'] ?? 'good', // good, damaged, incomplete
                'notes' => $itemData['notes'] ?? null,
                'created_at' => now(),
            ]);

            // Create medicine batch if new
            $this->createMedicineBatchIfNotExists(
                $grn->tenant_id,
                $itemData['medicine_id'],
                $itemData['batch_number'],
                $itemData['expiry_date'],
                $itemData['quantity_received'],
                $grn->warehouse_id
            );

            return [
                'status' => 'success',
                'receipt_item_id' => $receiptItem->id,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Finalize goods receipt
     */
    public function finalizeGoodsReceipt(
        string $grnId,
        ?array $qualityNotes = null
    ): array {
        try {
            $grn = PharmacyGoodsReceipt::findOrFail($grnId);

            if ($grn->status !== 'in_progress') {
                return [
                    'status' => 'error',
                    'message' => 'GRN is not in progress',
                ];
            }

            $items = PharmacyReceiptItem::where('grn_id', $grnId)->get();

            if ($items->isEmpty()) {
                return [
                    'status' => 'error',
                    'message' => 'GRN must have at least 1 item',
                ];
            }

            // Calculate totals
            $totalReceived = $items->sum('quantity_received');
            $totalAmount = $items->sum('line_total');
            $varianceCount = $items->whereNotIn('variance', [0])->count();

            $grn->update([
                'status' => 'finalized',
                'total_items' => $items->count(),
                'total_received' => $totalReceived,
                'total_amount' => $totalAmount,
                'variance_items' => $varianceCount,
                'quality_inspection_notes' => $qualityNotes ? json_encode($qualityNotes) : null,
                'finalized_at' => now(),
                'finalized_by' => auth()->user()->id,
            ]);

            // Update PO status if all items received
            $this->checkPOCompletion($grn->po_id);

            return [
                'status' => 'success',
                'message' => 'GRN finalized',
                'total_received' => $totalReceived,
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Helper: Generate PO number
     */
    protected function generatePONumber(string $tenantId): string
    {
        $prefix = 'PO-' . now()->format('Ym');
        $lastPO = PharmacyPurchaseOrder::where('tenant_id', $tenantId)
            ->where('po_number', 'like', $prefix . '%')
            ->orderBy('po_number', 'desc')
            ->first();

        $sequence = 1;
        if ($lastPO) {
            $lastSeq = (int) substr($lastPO->po_number, -4);
            $sequence = $lastSeq + 1;
        }

        return $prefix . '-' . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Helper: Generate GRN number
     */
    protected function generateGRNNumber(string $tenantId): string
    {
        $prefix = 'GRN-' . now()->format('Ym');
        $lastGRN = PharmacyGoodsReceipt::where('tenant_id', $tenantId)
            ->where('grn_number', 'like', $prefix . '%')
            ->orderBy('grn_number', 'desc')
            ->first();

        $sequence = 1;
        if ($lastGRN) {
            $lastSeq = (int) substr($lastGRN->grn_number, -4);
            $sequence = $lastSeq + 1;
        }

        return $prefix . '-' . str_pad((string) $sequence, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Helper: Recalculate PO totals
     */
    protected function recalculatePOTotals(string $poId): void
    {
        $po = PharmacyPurchaseOrder::findOrFail($poId);
        
        $items = PharmacyPurchaseOrderItem::where('po_id', $poId)->get();
        $totalAmount = $items->sum('line_total');
        $discount = $po->total_discount ?? 0;
        $tax = $po->total_tax ?? 0;
        
        $po->update([
            'total_amount' => $totalAmount,
            'grand_total' => ($totalAmount - $discount) + $tax,
        ]);
    }

    /**
     * Helper: Create medicine batch
     */
    protected function createMedicineBatchIfNotExists(
        string $tenantId,
        string $medicineId,
        string $batchNumber,
        string $expiryDate,
        int $quantity,
        string $warehouseId
    ): void {
        $existing = MedicineBatchModel::where('tenant_id', $tenantId)
            ->where('medicine_id', $medicineId)
            ->where('batch_number', $batchNumber)
            ->first();

        if (!$existing) {
            MedicineBatchModel::create([
                'id' => Str::uuid(),
                'tenant_id' => $tenantId,
                'medicine_id' => $medicineId,
                'batch_number' => $batchNumber,
                'expiry_date' => $expiryDate,
                'quantity' => $quantity,
                'warehouse_id' => $warehouseId,
                'created_at' => now(),
            ]);
        }
    }

    /**
     * Helper: Check PO completion
     */
    protected function checkPOCompletion(string $poId): void
    {
        $po = PharmacyPurchaseOrder::findOrFail($poId);
        
        $allItemsReceived = PharmacyReceiptItem::whereHas('grn', function ($q) use ($poId) {
            $q->where('po_id', $poId);
        })->count() === PharmacyPurchaseOrderItem::where('po_id', $poId)->count();

        if ($allItemsReceived) {
            $po->update(['status' => 'received']);
        }
    }

    /**
     * Helper: Notify approver
     */
    protected function notifyApprover(PharmacyPurchaseOrder $po): void
    {
        // TODO: Implement notification service
        // $this->notificationService->notifyApprovers($po);
    }

    /**
     * Helper: Log supplier notification
     */
    protected function logSupplierNotification(PharmacyPurchaseOrder $po, string $eventType): void
    {
        // TODO: Log to external system or queue
    }
}
