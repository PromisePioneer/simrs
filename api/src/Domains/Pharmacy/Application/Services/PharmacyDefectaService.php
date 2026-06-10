<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyDefectaReport;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PharmacyDefectaService
{
    /**
     * Generate defecta report - list medicines that need reordering
     */
    public function generateDefectaReport(string $tenantId, ?string $warehouseId = null): array
    {
        $defectaItems = [];

        // Get all active medicines
        $medicines = MedicineModel::where('tenant_id', $tenantId)
            ->where('is_for_sell', true)
            ->get();

        foreach ($medicines as $medicine) {
            $defectaReasons = [];
            $isUrgent = false;

            // Check 1: Low stock
            $currentStock = $this->getCurrentStock($medicine->id, $warehouseId, $tenantId);
            $minimumStock = $medicine->minimum_stock_amount ?? 10;

            if ($currentStock < $minimumStock) {
                $defectaReasons[] = 'low_stock';
                $daysUntilStockout = $this->calculateDaysUntilStockout($medicine->id, $currentStock);
                if ($daysUntilStockout && $daysUntilStockout <= 3) {
                    $isUrgent = true;
                }
            }

            // Check 2: Expiring soon
            $expiringBatches = $this->getExpiringBatches($medicine->id, $warehouseId);
            if (count($expiringBatches) > 0) {
                $defectaReasons[] = 'expired_soon';
                if ($expiringBatches[0]['days_until_expiry'] <= 7) {
                    $isUrgent = true;
                }
            }

            // Check 3: High demand (fast moving)
            $isHighDemand = $this->isHighDemandMedicine($medicine->id, $tenantId);
            if ($isHighDemand && $currentStock < $minimumStock * 1.5) {
                $defectaReasons[] = 'high_demand';
                $isUrgent = true;
            }

            // Create defecta record if needed
            if (!empty($defectaReasons)) {
                $reorderQuantity = $this->calculateReorderQuantity($medicine, $currentStock);
                $estimatedCost = $reorderQuantity * ($medicine->reference_purchase_price ?? 0);

                $defectaReport = PharmacyDefectaReport::create([
                    'tenant_id' => $tenantId,
                    'medicine_id' => $medicine->id,
                    'report_date' => now()->format('Y-m-d'),
                    'defecta_reason' => implode(',', $defectaReasons),
                    'current_stock' => $currentStock,
                    'minimum_stock' => $minimumStock,
                    'reorder_quantity' => $reorderQuantity,
                    'estimated_cost' => $estimatedCost,
                    'days_until_stockout' => $this->calculateDaysUntilStockout($medicine->id, $currentStock),
                    'is_urgent' => $isUrgent,
                ]);

                $defectaItems[] = $defectaReport;
            }
        }

        return $defectaItems;
    }

    /**
     * Get defecta items by urgency level
     */
    public function getDefectaByUrgency(string $tenantId, string $urgency = 'all'): array
    {
        $query = PharmacyDefectaReport::where('tenant_id', $tenantId)
            ->where('report_date', now()->format('Y-m-d'))
            ->where('is_ordered', false);

        if ($urgency === 'urgent') {
            $query->where('is_urgent', true);
        } elseif ($urgency === 'normal') {
            $query->where('is_urgent', false);
        }

        return $query->with('medicine')
            ->orderByDesc('is_urgent')
            ->get()
            ->toArray();
    }

    /**
     * Mark defecta as ordered
     */
    public function markAsOrdered(string $defectaId, string $poId): PharmacyDefectaReport
    {
        $defecta = PharmacyDefectaReport::findOrFail($defectaId);

        $defecta->update([
            'is_ordered' => true,
            'ordered_by' => auth()->id(),
            'ordered_at' => now(),
            'po_id' => $poId,
        ]);

        return $defecta;
    }

    /**
     * Get current stock for medicine
     */
    private function getCurrentStock(string $medicineId, ?string $warehouseId, string $tenantId): int
    {
        $query = DB::table('medicine_batch_stocks as mbs')
            ->join('medicine_batches as mb', 'mbs.batch_id', '=', 'mb.id')
            ->where('mb.medicine_id', $medicineId)
            ->where('mb.tenant_id', $tenantId)
            ->where('mb.expired_date', '>', now());

        if ($warehouseId) {
            $query->where('mbs.warehouse_id', $warehouseId);
        }

        return $query->sum('mbs.quantity') ?? 0;
    }

    /**
     * Get batches expiring soon
     */
    private function getExpiringBatches(string $medicineId, ?string $warehouseId): array
    {
        $query = DB::table('medicine_batch_stocks as mbs')
            ->join('medicine_batches as mb', 'mbs.batch_id', '=', 'mb.id')
            ->select('mb.id', 'mb.batch_number', 'mb.expired_date', 'mbs.quantity')
            ->where('mb.medicine_id', $medicineId)
            ->whereRaw('mb.expired_date <= DATE_ADD(NOW(), INTERVAL 30 DAY)')
            ->whereRaw('mb.expired_date > NOW()')
            ->orderBy('mb.expired_date');

        if ($warehouseId) {
            $query->where('mbs.warehouse_id', $warehouseId);
        }

        return $query->get()
            ->map(fn($batch) => [
                'batch_id' => $batch->id,
                'batch_number' => $batch->batch_number,
                'expiry_date' => $batch->expired_date,
                'quantity' => $batch->quantity,
                'days_until_expiry' => Carbon::parse($batch->expired_date)->diffInDays(now()),
            ])
            ->toArray();
    }

    /**
     * Check if medicine is high demand (fast moving)
     */
    private function isHighDemandMedicine(string $medicineId, string $tenantId): bool
    {
        $thirtyDaysAgo = now()->subDays(30);

        $totalSold = DB::table('pharmacy_sales_items as psi')
            ->join('pharmacy_sales as ps', 'psi.sales_id', '=', 'ps.id')
            ->where('ps.tenant_id', $tenantId)
            ->where('psi.medicine_batch_id', 'like', '%' . $medicineId . '%')
            ->where('ps.created_at', '>=', $thirtyDaysAgo)
            ->sum('psi.quantity_sold') ?? 0;

        return $totalSold > 100;
    }

    /**
     * Calculate days until stockout
     */
    private function calculateDaysUntilStockout(string $medicineId, int $currentStock): ?int
    {
        if ($currentStock <= 0) {
            return 0;
        }

        // Get average daily sales for last 30 days
        $thirtyDaysAgo = now()->subDays(30);

        $totalSold = DB::table('pharmacy_sales_items as psi')
            ->join('pharmacy_sales as ps', 'psi.sales_id', '=', 'ps.id')
            ->whereRaw('psi.medicine_batch_id LIKE ?', ['%' . $medicineId . '%'])
            ->where('ps.created_at', '>=', $thirtyDaysAgo)
            ->sum('psi.quantity_sold') ?? 0;

        if ($totalSold === 0) {
            return null;
        }

        $averageDailySales = $totalSold / 30;
        return (int)ceil($currentStock / $averageDailySales);
    }

    /**
     * Calculate reorder quantity using EOQ (Economic Order Quantity)
     */
    private function calculateReorderQuantity(MedicineModel $medicine, int $currentStock): int
    {
        $minimumStock = $medicine->minimum_stock_amount ?? 10;
        $safetyStock = $minimumStock;
        $averageDailySales = $this->getAverageDailySales($medicine->id) ?? 5;

        // Reorder Point: (Average Daily Sales × Lead Time) + Safety Stock
        // Lead time assumed 7 days
        $leadTime = 7;
        $reorderPoint = ($averageDailySales * $leadTime) + $safetyStock;

        // Reorder Quantity: Maximum Stock - Current Stock
        $maxStock = $minimumStock * 3;
        $reorderQty = max($maxStock - $currentStock, 50);

        return max((int)$reorderQty, 50);
    }

    /**
     * Get average daily sales for medicine
     */
    private function getAverageDailySales(string $medicineId): ?float
    {
        $thirtyDaysAgo = now()->subDays(30);

        $totalSold = DB::table('pharmacy_sales_items as psi')
            ->join('pharmacy_sales as ps', 'psi.sales_id', '=', 'ps.id')
            ->whereRaw('psi.medicine_batch_id LIKE ?', ['%' . $medicineId . '%'])
            ->where('ps.created_at', '>=', $thirtyDaysAgo)
            ->sum('psi.quantity_sold') ?? 0;

        return $totalSold > 0 ? $totalSold / 30 : null;
    }
}
