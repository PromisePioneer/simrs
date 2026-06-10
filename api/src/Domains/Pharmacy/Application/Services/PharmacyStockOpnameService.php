<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyStockOpname;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyStockOpnameItem;
use Illuminate\Support\Facades\DB;

class PharmacyStockOpnameService
{
    /**
     * Create a new stock opname session
     */
    public function createOpname(string $tenantId, array $data): PharmacyStockOpname
    {
        $opnameNumber = $this->generateOpnameNumber($tenantId);

        return PharmacyStockOpname::create([
            'tenant_id' => $tenantId,
            'opname_number' => $opnameNumber,
            'warehouse_id' => $data['warehouse_id'],
            'opname_date' => $data['opname_date'] ?? now()->format('Y-m-d'),
            'status' => 'draft',
            'started_by' => auth()->id(),
            'started_at' => now(),
            'notes' => $data['notes'] ?? null,
        ]);
    }

    /**
     * Add opname item
     */
    public function addOpnameItem(string $opnameId, array $data): PharmacyStockOpnameItem
    {
        $opname = PharmacyStockOpname::findOrFail($opnameId);

        if ($opname->status !== 'in_progress' && $opname->status !== 'draft') {
            throw new \Exception('Cannot add items to finalized opname');
        }

        $systemQuantity = $this->getSystemQuantity(
            $data['medicine_batch_id'],
            $opname->warehouse_id
        );

        $variance = $data['physical_quantity'] - $systemQuantity;
        $varianceAmount = $variance * ($data['unit_cost'] ?? 0);

        return PharmacyStockOpnameItem::create([
            'opname_id' => $opnameId,
            'medicine_batch_id' => $data['medicine_batch_id'],
            'system_quantity' => $systemQuantity,
            'physical_quantity' => $data['physical_quantity'],
            'variance' => $variance,
            'variance_amount' => $varianceAmount,
            'variance_reason' => $data['variance_reason'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);
    }

    /**
     * Finalize opname and calculate total variances
     */
    public function finalizeOpname(string $opnameId): PharmacyStockOpname
    {
        return DB::transaction(function () use ($opnameId) {
            $opname = PharmacyStockOpname::with('items')->findOrFail($opnameId);

            if ($opname->status === 'finalized') {
                throw new \Exception('Opname already finalized');
            }

            $totalVarianceAmount = $opname->items->sum('variance_amount');

            $opname->update([
                'status' => 'finalized',
                'finalized_by' => auth()->id(),
                'finalized_at' => now(),
                'total_variance_amount' => $totalVarianceAmount,
            ]);

            return $opname;
        });
    }

    /**
     * Reconcile opname - apply variances to system
     */
    public function reconcileOpname(string $opnameId): PharmacyStockOpname
    {
        return DB::transaction(function () use ($opnameId) {
            $opname = PharmacyStockOpname::with('items')->findOrFail($opnameId);

            if ($opname->status !== 'finalized') {
                throw new \Exception('Opname must be finalized before reconciliation');
            }

            foreach ($opname->items as $item) {
                if ($item->variance !== 0) {
                    // Update stock based on variance
                    DB::table('medicine_batch_stocks')
                        ->where('batch_id', $item->medicine_batch_id)
                        ->where('warehouse_id', $opname->warehouse_id)
                        ->update(['quantity' => $item->physical_quantity]);

                    // Log adjustment in general ledger
                    $this->logAdjustment($opname, $item);
                }
            }

            $opname->update(['status' => 'reconciled']);
            return $opname;
        });
    }

    /**
     * Get variance report
     */
    public function getVarianceReport(string $opnameId): array
    {
        $opname = PharmacyStockOpname::with('items')->findOrFail($opnameId);

        $variances = $opname->items
            ->filter(fn($item) => $item->variance !== 0)
            ->map(fn($item) => [
                'medicine_batch_id' => $item->medicine_batch_id,
                'system_quantity' => $item->system_quantity,
                'physical_quantity' => $item->physical_quantity,
                'variance' => $item->variance,
                'variance_amount' => $item->variance_amount,
                'variance_reason' => $item->variance_reason,
            ])
            ->values()
            ->all();

        return [
            'opname_number' => $opname->opname_number,
            'opname_date' => $opname->opname_date,
            'warehouse_id' => $opname->warehouse_id,
            'status' => $opname->status,
            'total_items_counted' => $opname->items->count(),
            'items_with_variance' => count($variances),
            'total_variance_amount' => $opname->total_variance_amount,
            'variances' => $variances,
        ];
    }

    /**
     * Get system quantity for a batch in warehouse
     */
    private function getSystemQuantity(string $medicineBatchId, string $warehouseId): int
    {
        $stock = DB::table('medicine_batch_stocks')
            ->where('batch_id', $medicineBatchId)
            ->where('warehouse_id', $warehouseId)
            ->first();

        return $stock ? $stock->quantity : 0;
    }

    /**
     * Generate unique opname number
     */
    private function generateOpnameNumber(string $tenantId): string
    {
        $prefix = 'OPN';
        $date = now()->format('Ym');
        $count = PharmacyStockOpname::where('tenant_id', $tenantId)
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count() + 1;

        return sprintf('%s-%s-%04d', $prefix, $date, $count);
    }

    /**
     * Log stock adjustment in general ledger
     */
    private function logAdjustment(PharmacyStockOpname $opname, PharmacyStockOpnameItem $item): void
    {
        DB::table('pharmacy_general_ledger_stock')->insert([
            'id' => \Illuminate\Support\Str::uuid(),
            'tenant_id' => $opname->tenant_id,
            'medicine_batch_id' => $item->medicine_batch_id,
            'transaction_date' => $opname->opname_date,
            'transaction_type' => 'opname',
            'reference_type' => 'opname_id',
            'reference_id' => $opname->id,
            'quantity_in' => max(0, $item->variance),
            'quantity_out' => abs(min(0, $item->variance)),
            'balance' => $item->physical_quantity,
            'notes' => 'Stock opname adjustment',
            'created_by' => auth()->id(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
