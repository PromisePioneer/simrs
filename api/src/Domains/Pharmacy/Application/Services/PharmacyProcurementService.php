<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\PharmacyPurchaseOrderRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\PharmacyGoodsReceiptRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\PharmacySafetyAlertRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPurchaseOrder;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyGoodsReceiptNote;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySafetyAlert;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchStockModel;
use Exception;

class PharmacyProcurementService
{
    public function __construct(
        private PharmacyPurchaseOrderRepositoryInterface $poRepository,
        private PharmacyGoodsReceiptRepositoryInterface $grnRepository,
        private PharmacySafetyAlertRepositoryInterface $alertRepository,
    ) {}

    /**
     * Create Purchase Order (Surat Pemesanan)
     */
    public function createPurchaseOrder(int $tenantId, array $data): PharmacyPurchaseOrder
    {
        $data['tenant_id'] = $tenantId;
        $data['po_number'] = $this->generatePONumber($tenantId);
        $data['po_date'] = now();
        $data['status'] = 'draft';
        $data['total_amount'] = 0;
        $data['discount_amount'] = 0;
        $data['tax_amount'] = 0;
        $data['grand_total'] = 0;

        return $this->poRepository->create($data);
    }

    /**
     * Add item to Purchase Order
     */
    public function addPOItem(int $poId, array $itemData): void
    {
        $po = $this->poRepository->findById($poId);
        
        if (!$po || $po->status !== 'draft') {
            throw new Exception('Purchase Order tidak ditemukan atau tidak bisa diubah');
        }

        $subtotal = $itemData['quantity'] * $itemData['unit_price'];
        $itemData['subtotal'] = $subtotal;

        $po->items()->create($itemData);
        $this->recalculatePOTotal($poId);
    }

    /**
     * Submit Purchase Order for Approval
     */
    public function submitPurchaseOrder(int $poId, int $userId): void
    {
        $po = $this->poRepository->findById($poId);

        if (!$po || $po->status !== 'draft') {
            throw new Exception('Hanya PO draft yang bisa disubmit');
        }

        if ($po->items()->count() === 0) {
            throw new Exception('PO harus memiliki minimal 1 item');
        }

        $this->poRepository->update($poId, [
            'status' => 'submitted',
        ]);
    }

    /**
     * Approve Purchase Order
     */
    public function approvePurchaseOrder(int $poId, int $approverUserId): void
    {
        $po = $this->poRepository->findById($poId);

        if (!$po || $po->status !== 'submitted') {
            throw new Exception('Hanya PO yang disubmit yang bisa diapprove');
        }

        $this->poRepository->update($poId, [
            'status' => 'approved',
            'approved_by' => $approverUserId,
            'approved_at' => now(),
        ]);
    }

    /**
     * Register Goods Receipt (Penerimaan Barang)
     */
    public function registerGoodsReceipt(int $tenantId, int $poId, array $receiptData): PharmacyGoodsReceiptNote
    {
        $po = $this->poRepository->findById($poId);

        if (!$po || $po->status !== 'approved') {
            throw new Exception('PO harus sudah diapprove sebelum menerima barang');
        }

        $receiptData['tenant_id'] = $tenantId;
        $receiptData['purchase_order_id'] = $poId;
        $receiptData['grn_number'] = $this->generateGRNNumber($tenantId);
        $receiptData['receipt_date'] = now();
        $receiptData['status'] = 'draft';

        return $this->grnRepository->create($receiptData);
    }

    /**
     * Add item to Goods Receipt with Batch Tracking
     */
    public function addGRNItem(int $grnId, array $itemData): void
    {
        $grn = $this->grnRepository->findById($grnId);

        if (!$grn || $grn->status !== 'draft') {
            throw new Exception('GRN tidak ditemukan atau sudah final');
        }

        // Validasi batch number belum ada
        if ($itemData['batch_number'] && $itemData['expiry_date']) {
            $existingBatch = MedicineBatchModel::where('batch_number', $itemData['batch_number'])
                ->where('medicine_id', $itemData['medicine_id'])
                ->first();

            if (!$existingBatch) {
                // Create new batch
                $batch = MedicineBatchModel::create([
                    'medicine_id' => $itemData['medicine_id'],
                    'batch_number' => $itemData['batch_number'],
                    'manufacture_date' => $itemData['manufacture_date'] ?? null,
                    'expiry_date' => $itemData['expiry_date'],
                    'quantity_received' => $itemData['quantity_received'],
                    'status' => 'active',
                ]);
                $itemData['medicine_batch_id'] = $batch->id;
            } else {
                $itemData['medicine_batch_id'] = $existingBatch->id;
            }
        }

        $grn->items()->create($itemData);

        // Create safety alert if expiry date is close
        $this->checkExpiryDateAndCreateAlert($itemData['medicine_batch_id'], $itemData['expiry_date']);
    }

    /**
     * Complete Goods Receipt and Update Stock
     */
    public function completeGoodsReceipt(int $grnId): void
    {
        $grn = $this->grnRepository->findById($grnId);

        if (!$grn) {
            throw new Exception('GRN tidak ditemukan');
        }

        // Update batch stock for each item
        foreach ($grn->items as $item) {
            if ($item->medicine_batch_id) {
                $batchStock = MedicineBatchStockModel::firstOrCreate(
                    [
                        'medicine_batch_id' => $item->medicine_batch_id,
                        'warehouse_id' => $grn->purchaseOrder->warehouse_id,
                    ],
                    [
                        'quantity' => 0,
                        'status' => 'active',
                    ]
                );

                $batchStock->quantity += $item->quantity_received;
                $batchStock->save();

                // Update PO item received quantity
                $item->purchaseOrderItem->quantity_received += $item->quantity_received;
                $item->purchaseOrderItem->save();
            }
        }

        $this->grnRepository->update($grnId, [
            'status' => 'complete',
        ]);

        // Check if PO is fully received
        $this->checkPOFullyReceived($grn->purchase_order_id);
    }

    /**
     * Create Purchase Return (Retur ke Supplier)
     */
    public function createPurchaseReturn(int $tenantId, array $data): void
    {
        $data['tenant_id'] = $tenantId;
        $data['return_number'] = $this->generateReturnNumber($tenantId);
        $data['return_date'] = now();
        $data['status'] = 'draft';

        // Store in database via repository
        $return = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPurchaseReturn::create($data);

        // Create return items
        if (isset($data['items'])) {
            foreach ($data['items'] as $item) {
                $return->items()->create($item);
            }
        }
    }

    /**
     * Check expiry date and create safety alert
     */
    private function checkExpiryDateAndCreateAlert(int $batchId, string $expiryDate): void
    {
        $batch = MedicineBatchModel::find($batchId);
        $daysUntilExpiry = now()->diffInDays(\Carbon\Carbon::parse($expiryDate));

        if ($daysUntilExpiry <= 0) {
            // Already expired
            $this->alertRepository->create([
                'medicine_batch_id' => $batchId,
                'alert_type' => 'expired',
                'title' => "Obat {$batch->medicine->name} Sudah Kedaluwarsa",
                'message' => "Batch: {$batch->batch_number} kedaluwarsa pada {$expiryDate}",
                'severity' => 'danger',
                'alert_triggered_at' => now(),
                'status' => 'active',
            ]);
        } elseif ($daysUntilExpiry <= 30) {
            // Expired soon
            $this->alertRepository->create([
                'medicine_batch_id' => $batchId,
                'alert_type' => 'expired_soon',
                'title' => "Obat {$batch->medicine->name} Akan Kedaluwarsa",
                'message' => "Batch: {$batch->batch_number} akan kedaluwarsa dalam {$daysUntilExpiry} hari",
                'severity' => 'warning',
                'days_threshold' => $daysUntilExpiry,
                'alert_triggered_at' => now(),
                'status' => 'active',
            ]);
        }
    }

    /**
     * Recalculate PO Total
     */
    private function recalculatePOTotal(int $poId): void
    {
        $po = $this->poRepository->findById($poId);
        $subtotal = $po->items->sum('subtotal');
        $discountAmount = ($subtotal * ($po->supplier->discount_percentage ?? 0)) / 100;
        $taxableAmount = $subtotal - $discountAmount;
        $taxAmount = ($taxableAmount * ($po->supplier->tax_percentage ?? 0)) / 100;
        $grandTotal = $taxableAmount + $taxAmount;

        $this->poRepository->update($poId, [
            'total_amount' => $subtotal,
            'discount_amount' => $discountAmount,
            'tax_amount' => $taxAmount,
            'grand_total' => $grandTotal,
        ]);
    }

    /**
     * Check if PO is fully received
     */
    private function checkPOFullyReceived(int $poId): void
    {
        $po = $this->poRepository->findById($poId);
        $allReceived = $po->items->every(function ($item) {
            return $item->quantity_received >= $item->quantity;
        });

        if ($allReceived) {
            $this->poRepository->update($poId, [
                'status' => 'received',
            ]);
        }
    }

    /**
     * Generate PO Number
     */
    private function generatePONumber(int $tenantId): string
    {
        $year = now()->year;
        $month = str_pad(now()->month, 2, '0', STR_PAD_LEFT);
        $count = PharmacyPurchaseOrder::where('tenant_id', $tenantId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('PO-%04d-%02d-%04d', $year, $month, $count);
    }

    /**
     * Generate GRN Number
     */
    private function generateGRNNumber(int $tenantId): string
    {
        $year = now()->year;
        $month = str_pad(now()->month, 2, '0', STR_PAD_LEFT);
        $count = PharmacyGoodsReceiptNote::where('tenant_id', $tenantId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('GRN-%04d-%02d-%04d', $year, $month, $count);
    }

    /**
     * Generate Return Number
     */
    private function generateReturnNumber(int $tenantId): string
    {
        $year = now()->year;
        $month = str_pad(now()->month, 2, '0', STR_PAD_LEFT);
        $count = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPurchaseReturn::where('tenant_id', $tenantId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('RET-%04d-%02d-%04d', $year, $month, $count);
    }
}
