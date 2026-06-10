<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\IRecallLogRepository;
use Carbon\Carbon;

class PharmacyRecallManagementService
{
    public function __construct(
        private readonly IRecallLogRepository $recallRepo
    ) {}

    public function initiateRecall(string $tenantId, array $data): array
    {
        $recallNumber = 'RCL-' . date('Ymd') . '-' . str_pad((string)($this->recallRepo->getActive($tenantId)->count() + 1), 4, '0', STR_PAD_LEFT);

        $recall = $this->recallRepo->create([
            'tenant_id' => $tenantId,
            'recall_number' => $recallNumber,
            'status' => 'initiated',
            'initiated_by' => auth()->id(),
            'initiated_at' => now(),
            ...$data,
        ]);

        // Identifikasi distribusi yang terdampak
        $distributions = $this->recallRepo->countDistributionsByBatch(
            $tenantId, $data['medicine_id'], $data['batch_number'] ?? null
        );

        $count = 0;
        foreach ($distributions as $dist) {
            $this->recallRepo->createImpact([
                'recall_id' => $recall->id,
                'distribution_id' => $dist->id,
                'medicine_id' => $dist->medicine_id,
                'batch_number' => $dist->batch_number,
                'patient_id' => $dist->patient_id,
                'patient_name' => $dist->patient_name,
                'patient_mrn' => $dist->patient_mrn,
                'quantity_distributed' => $dist->quantity_distributed,
                'quantity_recovered' => 0,
                'status' => 'identified',
            ]);
            $count++;
        }

        $this->recallRepo->update($recall->id, ['status' => 'notified']);

        return [
            'status' => 'success',
            'recall_id' => $recall->id,
            'recall_number' => $recallNumber,
            'affected_distributions' => $count,
        ];
    }

    public function getActiveRecalls(string $tenantId): array
    {
        return collect($this->recallRepo->getActive($tenantId))
            ->map(fn($r) => array_merge($r->toArray(), [
                'total_affected' => collect($r->impacts)->sum('quantity_distributed'),
                'total_recovered' => collect($r->impacts)->sum('quantity_recovered'),
            ]))
            ->toArray();
    }

    public function getRecallReport(string $recallId): array
    {
        $recall = $this->recallRepo->findById($recallId);
        $impacts = collect($recall->impacts);
        return [
            'recall' => $recall->only(['id', 'recall_number', 'recall_type', 'recall_class', 'recall_reason', 'status', 'initiated_at', 'completed_at']),
            'medicine' => ['name' => $recall->medicine?->name, 'batch_number' => $recall->batch_number],
            'summary' => [
                'total_affected' => $impacts->sum('quantity_distributed'),
                'total_recovered' => $impacts->sum('quantity_recovered'),
                'recovery_rate' => $impacts->sum('quantity_distributed') > 0
                    ? round($impacts->sum('quantity_recovered') / $impacts->sum('quantity_distributed') * 100, 1) : 0,
                'patients_affected' => $impacts->whereNotNull('patient_id')->unique('patient_id')->count(),
            ],
            'by_status' => $impacts->groupBy('status')->map(fn($g) => ['count' => $g->count(), 'qty' => $g->sum('quantity_distributed')]),
        ];
    }

    public function updateImpactStatus(string $impactId, string $status, int $quantityRecovered, ?string $notes): array
    {
        $this->recallRepo->updateImpact($impactId, [
            'status' => $status,
            'quantity_recovered' => $quantityRecovered,
            'notes' => $notes,
            'handled_by' => auth()->id(),
            'handled_at' => now(),
        ]);

        // Auto-complete jika semua impacts sudah selesai
        $impact = $this->recallRepo->findImpact($impactId);
        $pending = collect($this->recallRepo->getImpactsByRecall($impact->recall_id))
            ->whereNotIn('status', ['recovered', 'not_recoverable'])
            ->count();

        if ($pending === 0) {
            $this->recallRepo->update($impact->recall_id, ['status' => 'completed', 'completed_at' => now()]);
        }

        return ['status' => 'success'];
    }

    public function completeRecall(string $recallId, string $notes): array
    {
        $this->recallRepo->update($recallId, [
            'status' => 'completed',
            'completed_by' => auth()->id(),
            'completed_at' => now(),
            'completion_notes' => $notes,
        ]);
        return ['status' => 'success'];
    }
}
