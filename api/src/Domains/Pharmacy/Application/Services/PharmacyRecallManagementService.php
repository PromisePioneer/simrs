<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyRecallLog;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyRecallImpact;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyBatchDistribution;
use Illuminate\Support\Str;

/**
 * PharmacyRecallManagementService
 *
 * Manajemen recall obat - BPOM mandatory, pabrikan, atau internal.
 * Otomatis identifikasi pasien terdampak dari data batch distribution.
 */
class PharmacyRecallManagementService
{
    /**
     * Inisiasi recall baru dan otomatis identifikasi dampak
     */
    public function initiateRecall(string $tenantId, array $data): array
    {
        $recallNumber = $this->generateRecallNumber($tenantId);

        $recall = PharmacyRecallLog::create([
            'id' => Str::uuid(),
            'tenant_id' => $tenantId,
            'recall_number' => $recallNumber,
            'medicine_id' => $data['medicine_id'],
            'batch_number' => $data['batch_number'] ?? null,
            'expiry_date' => $data['expiry_date'] ?? null,
            'recall_type' => $data['recall_type'],
            'recall_class' => $data['recall_class'] ?? 'class_ii',
            'recall_reason' => $data['recall_reason'],
            'recall_detail' => $data['recall_detail'] ?? null,
            'action_required' => $data['action_required'] ?? null,
            'status' => 'initiated',
            'bpom_recall_number' => $data['bpom_recall_number'] ?? null,
            'bpom_notification_date' => $data['bpom_notification_date'] ?? null,
            'recall_deadline' => $data['recall_deadline'] ?? null,
            'initiated_by' => auth()->id(),
            'initiated_at' => now(),
        ]);

        // Otomatis analisis dampak dari batch distribution history
        $impactCount = $this->analyzeRecallImpact($recall);

        return [
            'status' => 'success',
            'recall_id' => $recall->id,
            'recall_number' => $recallNumber,
            'affected_distributions' => $impactCount,
            'message' => "Recall initiated. {$impactCount} distribusi teridentifikasi terdampak.",
        ];
    }

    /**
     * Analisis dampak - cari semua distribusi batch yang di-recall
     */
    private function analyzeRecallImpact(PharmacyRecallLog $recall): int
    {
        $query = PharmacyBatchDistribution::where('tenant_id', $recall->tenant_id)
            ->where('medicine_id', $recall->medicine_id);

        if ($recall->batch_number) {
            $query->where('batch_number', $recall->batch_number);
        }

        $distributions = $query->get();

        foreach ($distributions as $dist) {
            PharmacyRecallImpact::create([
                'id' => Str::uuid(),
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
        }

        // Update status ke notified
        $recall->update(['status' => 'notified']);

        return $distributions->count();
    }

    /**
     * Update status handling per dampak individual
     */
    public function updateImpactStatus(string $impactId, string $status, int $quantityRecovered = 0, ?string $notes = null): array
    {
        $impact = PharmacyRecallImpact::findOrFail($impactId);
        $impact->update([
            'status' => $status,
            'quantity_recovered' => $quantityRecovered,
            'notes' => $notes,
            'handled_by' => auth()->id(),
            'handled_at' => now(),
        ]);

        // Cek apakah seluruh dampak sudah selesai
        $this->checkRecallCompletion($impact->recall_id);

        return ['status' => 'success', 'impact' => $impact->fresh()];
    }

    /**
     * Selesaikan recall
     */
    public function completeRecall(string $recallId, string $completionNotes): array
    {
        $recall = PharmacyRecallLog::findOrFail($recallId);

        $recall->update([
            'status' => 'completed',
            'completed_by' => auth()->id(),
            'completed_at' => now(),
            'completion_notes' => $completionNotes,
        ]);

        return [
            'status' => 'success',
            'recall_number' => $recall->recall_number,
            'total_impact' => $recall->total_impact_quantity_attribute,
            'total_recovered' => $recall->total_recovered_quantity_attribute,
        ];
    }

    /**
     * Laporan ringkas recall
     */
    public function getRecallReport(string $recallId): array
    {
        $recall = PharmacyRecallLog::with(['medicine', 'impacts', 'initiatedBy'])
            ->findOrFail($recallId);

        $impactsByStatus = $recall->impacts->groupBy('status')
            ->map(fn($g) => [
                'count' => $g->count(),
                'quantity' => $g->sum('quantity_distributed'),
                'recovered' => $g->sum('quantity_recovered'),
            ]);

        return [
            'recall' => $recall->only([
                'id', 'recall_number', 'recall_type', 'recall_class',
                'recall_reason', 'status', 'initiated_at', 'completed_at',
            ]),
            'medicine' => [
                'name' => $recall->medicine?->name,
                'batch_number' => $recall->batch_number,
            ],
            'summary' => [
                'total_affected' => $recall->impacts->sum('quantity_distributed'),
                'total_recovered' => $recall->impacts->sum('quantity_recovered'),
                'recovery_rate' => $recall->impacts->sum('quantity_distributed') > 0
                    ? round($recall->impacts->sum('quantity_recovered') / $recall->impacts->sum('quantity_distributed') * 100, 1)
                    : 0,
                'patients_affected' => $recall->impacts->whereNotNull('patient_id')->unique('patient_id')->count(),
            ],
            'impacts_by_status' => $impactsByStatus,
        ];
    }

    /**
     * Daftar recall aktif
     */
    public function getActiveRecalls(string $tenantId): array
    {
        return PharmacyRecallLog::byTenant($tenantId)
            ->active()
            ->with(['medicine', 'impacts'])
            ->orderBy('initiated_at', 'desc')
            ->get()
            ->map(fn($r) => array_merge($r->toArray(), [
                'total_affected' => $r->impacts->sum('quantity_distributed'),
                'total_recovered' => $r->impacts->sum('quantity_recovered'),
            ]))
            ->toArray();
    }

    private function checkRecallCompletion(string $recallId): void
    {
        $recall = PharmacyRecallLog::find($recallId);
        if (!$recall || $recall->status === 'completed') return;

        $pendingCount = $recall->impacts()
            ->whereNotIn('status', ['recovered', 'not_recoverable'])
            ->count();

        if ($pendingCount === 0) {
            $recall->update(['status' => 'completed', 'completed_at' => now()]);
        }
    }

    private function generateRecallNumber(string $tenantId): string
    {
        $prefix = 'RCL-' . date('Ymd');
        $lastNumber = PharmacyRecallLog::where('tenant_id', $tenantId)
            ->where('recall_number', 'like', $prefix . '%')
            ->count();
        return $prefix . '-' . str_pad((string)($lastNumber + 1), 4, '0', STR_PAD_LEFT);
    }
}
