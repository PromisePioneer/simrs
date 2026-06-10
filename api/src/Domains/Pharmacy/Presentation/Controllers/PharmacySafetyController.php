<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Traits\ApiResponse;
use Domains\Pharmacy\Application\Services\PharmacyBatchTracingService;
use Domains\Pharmacy\Application\Services\PharmacyRecallManagementService;
use Domains\Pharmacy\Application\Services\PharmacyHighAlertService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacySafetyController
{
    use ApiResponse;

    public function __construct(
        private readonly PharmacyBatchTracingService $batchService,
        private readonly PharmacyRecallManagementService $recallService,
        private readonly PharmacyHighAlertService $highAlertService,
    ) {}

    // ── BATCH TRACING ────────────────────────────────────────────────

    public function traceBatch(string $medicineId, string $batchNumber): JsonResponse
    {
        return $this->successResponse(
            $this->batchService->traceBatch(auth()->user()->tenant_id, $medicineId, $batchNumber)
        );
    }

    public function affectedPatients(string $medicineId, string $batchNumber): JsonResponse
    {
        return $this->successResponse([
            'patients' => $this->batchService->getAffectedPatients(auth()->user()->tenant_id, $medicineId, $batchNumber),
        ]);
    }

    public function distributionHistory(Request $request, string $medicineId): JsonResponse
    {
        return $this->successResponse(
            $this->batchService->getMedicineDistributionHistory(
                auth()->user()->tenant_id, $medicineId,
                $request->query('from'), $request->query('to')
            )
        );
    }

    public function expiryStatus(string $warehouseId): JsonResponse
    {
        return $this->successResponse([
            'batches' => $this->batchService->getBatchExpiryStatus($warehouseId),
        ]);
    }

    // ── RECALL ───────────────────────────────────────────────────────

    public function initiateRecall(Request $request): JsonResponse
    {
        $data = $request->validate([
            'medicine_id'           => 'required|uuid',
            'batch_number'          => 'nullable|string',
            'recall_type'           => 'required|in:bpom_mandatory,manufacturer,internal',
            'recall_class'          => 'nullable|in:class_i,class_ii,class_iii',
            'recall_reason'         => 'required|string|max:500',
            'recall_detail'         => 'nullable|string',
            'action_required'       => 'nullable|string',
            'bpom_recall_number'    => 'nullable|string',
            'bpom_notification_date'=> 'nullable|date',
            'recall_deadline'       => 'nullable|date',
        ]);
        return $this->successResponse(
            $this->recallService->initiateRecall(auth()->user()->tenant_id, $data), 201
        );
    }

    public function activeRecalls(): JsonResponse
    {
        return $this->successResponse([
            'recalls' => $this->recallService->getActiveRecalls(auth()->user()->tenant_id),
        ]);
    }

    public function recallReport(string $recallId): JsonResponse
    {
        return $this->successResponse($this->recallService->getRecallReport($recallId));
    }

    public function updateImpact(Request $request, string $impactId): JsonResponse
    {
        $data = $request->validate([
            'status'             => 'required|in:patient_notified,recovered,not_recoverable,pending',
            'quantity_recovered' => 'nullable|integer|min:0',
            'notes'              => 'nullable|string',
        ]);
        return $this->successResponse(
            $this->recallService->updateImpactStatus($impactId, $data['status'], $data['quantity_recovered'] ?? 0, $data['notes'] ?? null)
        );
    }

    public function completeRecall(Request $request, string $recallId): JsonResponse
    {
        $data = $request->validate(['completion_notes' => 'required|string']);
        return $this->successResponse($this->recallService->completeRecall($recallId, $data['completion_notes']));
    }

    // ── HIGH ALERT & LASA ────────────────────────────────────────────

    public function classifyHighAlert(Request $request): JsonResponse
    {
        $data = $request->validate([
            'medicine_id'              => 'required|uuid',
            'alert_level'              => 'required|in:high_alert,narcotics,psychotropics,precursor,cytotoxic,electrolyte_concentrate',
            'warning_label'            => 'nullable|string|max:255',
            'storage_requirement'      => 'nullable|string|max:500',
            'dispensing_precaution'    => 'nullable|string',
            'double_check_required'    => 'boolean',
            'requires_special_storage' => 'boolean',
            'visual_alert_color'       => 'nullable|string|max:10',
        ]);
        return $this->successResponse(
            $this->highAlertService->classifyHighAlert(auth()->user()->tenant_id, $data), 201
        );
    }

    public function highAlertList(Request $request): JsonResponse
    {
        return $this->successResponse([
            'high_alerts' => $this->highAlertService->getHighAlertList(auth()->user()->tenant_id, $request->query('level')),
        ]);
    }

    public function checkHighAlert(Request $request): JsonResponse
    {
        $data = $request->validate(['medicine_ids' => 'required|array|min:1', 'medicine_ids.*' => 'uuid']);
        return $this->successResponse([
            'alerts' => $this->highAlertService->checkHighAlert(auth()->user()->tenant_id, $data['medicine_ids']),
        ]);
    }

    public function deactivateHighAlert(string $medicineId): JsonResponse
    {
        return $this->successResponse(
            $this->highAlertService->deactivateHighAlert(auth()->user()->tenant_id, $medicineId)
        );
    }

    public function registerLASA(Request $request): JsonResponse
    {
        $data = $request->validate([
            'medicine_a_id'               => 'required|uuid',
            'medicine_b_id'               => 'required|uuid|different:medicine_a_id',
            'lasa_type'                   => 'required|in:look_alike,sound_alike,both',
            'similarity_reason'           => 'nullable|string|max:500',
            'requires_tall_man_lettering' => 'boolean',
            'tall_man_lettering_a'        => 'nullable|string|max:255',
            'tall_man_lettering_b'        => 'nullable|string|max:255',
        ]);
        return $this->successResponse(
            $this->highAlertService->registerLASAPair(auth()->user()->tenant_id, $data), 201
        );
    }

    public function lasaList(): JsonResponse
    {
        return $this->successResponse([
            'lasa_pairs' => $this->highAlertService->getLASAList(auth()->user()->tenant_id),
        ]);
    }

    public function checkLASA(Request $request): JsonResponse
    {
        $data = $request->validate(['medicine_ids' => 'required|array|min:1', 'medicine_ids.*' => 'uuid']);
        return $this->successResponse([
            'warnings' => $this->highAlertService->checkLASAWarnings(auth()->user()->tenant_id, $data['medicine_ids']),
        ]);
    }
}
