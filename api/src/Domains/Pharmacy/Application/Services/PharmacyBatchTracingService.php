<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\IBatchDistributionRepository;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Carbon\Carbon;

class PharmacyBatchTracingService
{
    public function __construct(
        private readonly IBatchDistributionRepository $batchRepo
    ) {}

    public function recordDistribution(string $tenantId, array $data): array
    {
        $dist = $this->batchRepo->create([
            'tenant_id' => $tenantId,
            'distributed_by' => auth()->id(),
            'distributed_at' => now(),
            ...$data,
        ]);
        return ['status' => 'success', 'distribution_id' => $dist->id];
    }

    public function traceBatch(string $tenantId, string $medicineId, string $batchNumber): array
    {
        $distributions = $this->batchRepo->findByBatch($tenantId, $medicineId, $batchNumber);
        $col = collect($distributions);
        return [
            'summary' => [
                'batch_number' => $batchNumber,
                'total_distributed' => $col->sum('quantity_distributed'),
                'total_transactions' => $col->count(),
                'first_distribution' => $col->first()?->distributed_at,
                'last_distribution' => $col->last()?->distributed_at,
                'patients_involved' => $col->whereNotNull('patient_id')->unique('patient_id')->count(),
                'by_type' => $col->groupBy('distribution_type')->map(fn($g) => ['count' => $g->count(), 'qty' => $g->sum('quantity_distributed')]),
            ],
            'distributions' => $col->values(),
        ];
    }

    public function getAffectedPatients(string $tenantId, string $medicineId, string $batchNumber): array
    {
        return collect($this->batchRepo->getAffectedPatients($tenantId, $medicineId, $batchNumber))->toArray();
    }

    public function getMedicineDistributionHistory(string $tenantId, string $medicineId, ?string $from, ?string $to): array
    {
        return $this->batchRepo->getByMedicine($tenantId, $medicineId, $from, $to);
    }

    public function getBatchExpiryStatus(string $warehouseId): array
    {
        $today = now();
        return MedicineBatchModel::where('warehouse_id', $warehouseId)
            ->where('quantity', '>', 0)
            ->with('medicine')
            ->orderBy('expiry_date')
            ->get()
            ->map(fn($b) => [
                'batch_id' => $b->id,
                'medicine_name' => $b->medicine?->name,
                'batch_number' => $b->batch_number,
                'expiry_date' => $b->expiry_date,
                'quantity' => $b->quantity,
                'days_to_expiry' => (int) $today->diffInDays($b->expiry_date, false),
                'status' => match(true) {
                    $today->diffInDays($b->expiry_date, false) < 0 => 'expired',
                    $today->diffInDays($b->expiry_date, false) <= 7 => 'critical',
                    $today->diffInDays($b->expiry_date, false) <= 30 => 'warning',
                    default => 'ok',
                },
            ])
            ->toArray();
    }
}
