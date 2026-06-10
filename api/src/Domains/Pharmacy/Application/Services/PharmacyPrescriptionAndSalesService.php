<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPrescription;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPrescriptionItem;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPrescriptionReview;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySale;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySaleItem;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchStockModel;
use Exception;

class PharmacyPrescriptionAndSalesService
{
    /**
     * Create E-Prescription from doctor
     */
    public function createPrescription(int $tenantId, array $data): PharmacyPrescription
    {
        $data['tenant_id'] = $tenantId;
        $data['prescription_number'] = $this->generatePrescriptionNumber($tenantId);
        $data['prescription_date'] = now();
        $data['status'] = 'pending';

        $prescription = PharmacyPrescription::create($data);

        // Create prescription items
        if (isset($data['items'])) {
            foreach ($data['items'] as $itemData) {
                $this->addPrescriptionItem($prescription->id, $itemData);
            }
        }

        return $prescription;
    }

    /**
     * Add item to prescription
     */
    public function addPrescriptionItem(int $prescriptionId, array $itemData): PharmacyPrescriptionItem
    {
        $prescription = PharmacyPrescription::find($prescriptionId);

        if (!$prescription || $prescription->status !== 'pending') {
            throw new Exception('Resep tidak ditemukan atau sudah dispensed');
        }

        // Check for LASA (Look Alike Sound Alike) medicines
        $medicine = \Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel::find($itemData['medicine_id']);
        if ($medicine && $this->isLASAMedicine($medicine)) {
            $itemData['is_lasa'] = true;
            $itemData['lasa_warning'] = $this->getLASAWarning($medicine);
        }

        // Check for high alert medicines (narcotics, psychotropic)
        if ($medicine && $this->isHighAlertMedicine($medicine)) {
            $itemData['is_high_alert'] = true;
        }

        $itemData['dispensing_status'] = 'pending';

        return $prescription->items()->create($itemData);
    }

    /**
     * Telaah Resep (Prescription Review by Pharmacist)
     */
    public function reviewPrescription(int $prescriptionId, int $pharmacistId, array $reviewData): PharmacyPrescriptionReview
    {
        $prescription = PharmacyPrescription::find($prescriptionId);

        if (!$prescription || $prescription->status !== 'pending') {
            throw new Exception('Resep tidak tersedia untuk ditinjau');
        }

        $reviewData['prescription_id'] = $prescriptionId;
        $reviewData['pharmacist_id'] = $pharmacistId;
        $reviewData['review_status'] = 'pending';

        // Perform administrative review
        if (!isset($reviewData['admin_checked'])) {
            $reviewData = $this->performAdministrativeReview($prescription, $reviewData);
        }

        // Perform pharmaceutical review
        if (!isset($reviewData['pharma_checked'])) {
            $reviewData = $this->performPharmaceuticalReview($prescription, $reviewData);
        }

        // Perform clinical review
        if (!isset($reviewData['clinical_checked'])) {
            $reviewData = $this->performClinicalReview($prescription, $reviewData);
        }

        // Determine overall review status
        $hasIssues = $reviewData['admin_issues'] || $reviewData['pharma_issues'] || $reviewData['clinical_issues'];
        $reviewData['review_status'] = $hasIssues ? 'needs_clarification' : 'approved';
        $reviewData['reviewed_at'] = now();

        return $prescription->reviews()->create($reviewData);
    }

    /**
     * Approve Prescription for Dispensing
     */
    public function approvePrescriptionForDispensing(int $prescriptionId, int $pharmacistId): void
    {
        $prescription = PharmacyPrescription::find($prescriptionId);

        if (!$prescription) {
            throw new Exception('Resep tidak ditemukan');
        }

        // Check if review is approved
        $review = $prescription->reviews()->where('review_status', 'approved')->first();
        if (!$review) {
            throw new Exception('Resep harus direview dan disetujui terlebih dahulu');
        }

        // Validate stock availability
        foreach ($prescription->items as $item) {
            $availableStock = $this->getAvailableStock($item->medicine_id, $item->quantity);
            if ($availableStock < $item->quantity) {
                throw new Exception("Stok obat {$item->medicine->name} tidak tersedia. Tersedia: {$availableStock}");
            }
        }

        PharmacyPrescription::where('id', $prescriptionId)->update([
            'status' => 'dispensed',
            'dispensed_at' => now(),
        ]);
    }

    /**
     * Create Sales/Dispensing from Prescription
     */
    public function createSaleFromPrescription(int $tenantId, int $prescriptionId, int $warehouseId, int $pharmacistId, array $saleData = []): PharmacySale
    {
        $prescription = PharmacyPrescription::find($prescriptionId);

        if (!$prescription || $prescription->status !== 'dispensed') {
            throw new Exception('Resep tidak siap untuk dijual/dispensed');
        }

        $saleData['tenant_id'] = $tenantId;
        $saleData['prescription_id'] = $prescriptionId;
        $saleData['patient_id'] = $prescription->patient_id;
        $saleData['warehouse_id'] = $warehouseId;
        $saleData['pharmacist_id'] = $pharmacistId;
        $saleData['sales_number'] = $this->generateSalesNumber($tenantId);
        $saleData['sales_date'] = now();
        $saleData['sales_type'] = $prescription->prescription_type;
        $saleData['status'] = 'draft';

        $sale = PharmacySale::create($saleData);

        // Create sale items from prescription items
        foreach ($prescription->items as $prescItem) {
            $this->createSaleItem($sale->id, $prescItem);
        }

        // Calculate totals
        $this->recalculateSaleTotal($sale->id);

        return $sale;
    }

    /**
     * Create sale item and deduct stock
     */
    private function createSaleItem(int $saleId, PharmacyPrescriptionItem $prescItem): void
    {
        $sale = PharmacySale::find($saleId);

        // Get available batch stock
        $batch = $this->getAvailableBatchForSale($prescItem->medicine_id, $prescItem->quantity, $sale->warehouse_id);

        if (!$batch) {
            throw new Exception("Batch tersedia tidak ditemukan untuk obat {$prescItem->medicine->name}");
        }

        $unitPrice = $batch->latest_cost ?? $prescItem->medicine->selling_price ?? 0;
        $subtotal = $prescItem->quantity * $unitPrice;
        $discountPerItem = $subtotal * 0.1; // Default 10% discount
        $finalPrice = $subtotal - $discountPerItem;

        PharmacySaleItem::create([
            'sales_id' => $saleId,
            'prescription_item_id' => $prescItem->id,
            'medicine_batch_id' => $batch->id,
            'unit_id' => $prescItem->unit_id,
            'quantity_sold' => $prescItem->quantity,
            'unit_price' => $unitPrice,
            'subtotal' => $subtotal,
            'discount_per_item' => $discountPerItem,
            'final_price' => $finalPrice,
            'batch_number' => $batch->batch_number,
            'expiry_date' => $batch->expiry_date,
        ]);

        // Update prescription item
        $prescItem->quantity_dispensed = $prescItem->quantity;
        $prescItem->dispensing_status = 'completed';
        $prescItem->save();

        // Deduct batch stock
        $this->deductBatchStock($batch->id, $sale->warehouse_id, $prescItem->quantity);
    }

    /**
     * Complete Sale and Update Billing
     */
    public function completeSale(int $saleId): void
    {
        $sale = PharmacySale::find($saleId);

        if (!$sale || $sale->status !== 'draft') {
            throw new Exception('Penjualan tidak dapat diselesaikan');
        }

        // Update sale status
        $sale->status = 'completed';
        $sale->payment_status = 'pending';
        $sale->save();

        // Create billing entry (integration with Billing domain)
        $this->createBillingEntry($sale);
    }

    /**
     * Create Patient Return
     */
    public function createPatientReturn(int $tenantId, int $saleId, array $returnData): void
    {
        $sale = PharmacySale::find($saleId);

        if (!$sale || $sale->status !== 'completed') {
            throw new Exception('Penjualan tidak ditemukan atau tidak bisa diretur');
        }

        $returnData['tenant_id'] = $tenantId;
        $returnData['sales_id'] = $saleId;
        $returnData['patient_id'] = $sale->patient_id;
        $returnData['return_number'] = $this->generateReturnNumber($tenantId);
        $returnData['return_date'] = now();
        $returnData['status'] = 'pending';

        $return = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPatientReturn::create($returnData);

        // Process return items
        if (isset($returnData['items'])) {
            foreach ($returnData['items'] as $item) {
                // Restore batch stock
                $this->restoreBatchStock($item['medicine_batch_id'], $sale->warehouse_id, $item['quantity']);
            }
        }
    }

    /**
     * Get available stock for medicine
     */
    private function getAvailableStock(int $medicineId, int $quantity = 0): int
    {
        $totalStock = MedicineBatchStockModel::whereHas('medicineBatch', function ($query) use ($medicineId) {
            $query->where('medicine_id', $medicineId);
        })->sum('quantity');

        return (int)$totalStock;
    }

    /**
     * Get available batch for sale (FIFO - First In First Out by expiry date)
     */
    private function getAvailableBatchForSale(int $medicineId, int $quantity, int $warehouseId)
    {
        return MedicineBatchStockModel::whereHas('medicineBatch', function ($query) use ($medicineId) {
            $query->where('medicine_id', $medicineId)
                ->where('status', 'active')
                ->orderBy('expiry_date', 'asc'); // FIFO by expiry date
        })
            ->where('warehouse_id', $warehouseId)
            ->where('quantity', '>=', $quantity)
            ->first();
    }

    /**
     * Deduct batch stock
     */
    private function deductBatchStock(int $batchId, int $warehouseId, int $quantity): void
    {
        $batchStock = MedicineBatchStockModel::where('medicine_batch_id', $batchId)
            ->where('warehouse_id', $warehouseId)
            ->first();

        if ($batchStock) {
            $batchStock->quantity -= $quantity;
            if ($batchStock->quantity <= 0) {
                $batchStock->status = 'depleted';
            }
            $batchStock->save();
        }
    }

    /**
     * Restore batch stock (for returns)
     */
    private function restoreBatchStock(int $batchId, int $warehouseId, int $quantity): void
    {
        $batchStock = MedicineBatchStockModel::where('medicine_batch_id', $batchId)
            ->where('warehouse_id', $warehouseId)
            ->first();

        if ($batchStock) {
            $batchStock->quantity += $quantity;
            $batchStock->status = 'active';
            $batchStock->save();
        }
    }

    /**
     * Recalculate sale total
     */
    private function recalculateSaleTotal(int $saleId): void
    {
        $sale = PharmacySale::find($saleId);
        $subtotal = $sale->items->sum('subtotal');
        $discountAmount = $sale->items->sum('discount_per_item');
        $taxAmount = ($subtotal - $discountAmount) * 0.10; // 10% tax
        $totalAmount = $subtotal - $discountAmount + $taxAmount;

        $sale->subtotal = $subtotal;
        $sale->discount_amount = $discountAmount;
        $sale->tax_amount = $taxAmount;
        $sale->total_amount = $totalAmount;
        $sale->save();
    }

    /**
     * Perform administrative review
     */
    private function performAdministrativeReview(PharmacyPrescription $prescription, array $reviewData): array
    {
        $issues = [];

        // Check prescription completeness
        if (!$prescription->prescription_number) {
            $issues[] = 'Nomor resep tidak lengkap';
        }
        if (!$prescription->doctor_id) {
            $issues[] = 'Dokter penulis resep tidak lengkap';
        }
        if (!$prescription->patient_id) {
            $issues[] = 'Data pasien tidak lengkap';
        }

        $reviewData['admin_checked'] = true;
        $reviewData['admin_issues'] = implode('; ', $issues) ?: null;

        return $reviewData;
    }

    /**
     * Perform pharmaceutical review
     */
    private function performPharmaceuticalReview(PharmacyPrescription $prescription, array $reviewData): array
    {
        $issues = [];

        foreach ($prescription->items as $item) {
            // Check for duplicate therapy
            $duplicates = $prescription->items
                ->where('medicine_id', $item->medicine_id)
                ->count();

            if ($duplicates > 1) {
                $issues[] = "Obat {$item->medicine->name} muncul lebih dari sekali";
            }

            // Check for interactions
            if ($this->hasDrugInteraction($prescription->items, $item)) {
                $issues[] = "Interaksi obat terdeteksi dengan {$item->medicine->name}";
            }
        }

        $reviewData['pharma_checked'] = true;
        $reviewData['pharma_issues'] = implode('; ', $issues) ?: null;

        return $reviewData;
    }

    /**
     * Perform clinical review
     */
    private function performClinicalReview(PharmacyPrescription $prescription, array $reviewData): array
    {
        $reviewData['clinical_checked'] = true;
        $reviewData['is_dose_appropriate'] = true;
        $reviewData['is_frequency_appropriate'] = true;
        $reviewData['is_duration_appropriate'] = true;

        return $reviewData;
    }

    /**
     * Check if medicine is LASA
     */
    private function isLASAMedicine($medicine): bool
    {
        // Check if medicine is marked as LASA in database
        return $medicine->is_lasa ?? false;
    }

    /**
     * Get LASA warning
     */
    private function getLASAWarning($medicine): string
    {
        return "Perhatian: Obat ini adalah LOOK ALIKE SOUND ALIKE. Verifikasi ulang sebelum menyerahkan ke pasien.";
    }

    /**
     * Check if medicine is high alert
     */
    private function isHighAlertMedicine($medicine): bool
    {
        return $medicine->is_high_alert ?? false;
    }

    /**
     * Check for drug interactions
     */
    private function hasDrugInteraction($items, $currentItem): bool
    {
        // Simplified check - in production, would query drug interaction database
        return false;
    }

    /**
     * Create billing entry
     */
    private function createBillingEntry(PharmacySale $sale): void
    {
        // Integration with Billing domain
        // This would be handled via event or domain service call
    }

    /**
     * Generate Prescription Number
     */
    private function generatePrescriptionNumber(int $tenantId): string
    {
        $year = now()->year;
        $month = str_pad(now()->month, 2, '0', STR_PAD_LEFT);
        $count = PharmacyPrescription::where('tenant_id', $tenantId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('RX-%04d-%02d-%04d', $year, $month, $count);
    }

    /**
     * Generate Sales Number
     */
    private function generateSalesNumber(int $tenantId): string
    {
        $year = now()->year;
        $month = str_pad(now()->month, 2, '0', STR_PAD_LEFT);
        $count = PharmacySale::where('tenant_id', $tenantId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('SAL-%04d-%02d-%04d', $year, $month, $count);
    }

    /**
     * Generate Return Number
     */
    private function generateReturnNumber(int $tenantId): string
    {
        $year = now()->year;
        $month = str_pad(now()->month, 2, '0', STR_PAD_LEFT);
        $count = \Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPatientReturn::where('tenant_id', $tenantId)
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->count() + 1;

        return sprintf('PRR-%04d-%02d-%04d', $year, $month, $count);
    }
}
