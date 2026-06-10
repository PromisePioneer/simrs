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
        private readonly PharmacyBatchTracingService $batchTracingService,
        private readonly PharmacyRecallManagementService $recallService,
        private readonly PharmacyHighAlertService $highAlertService,
    ) {}

    // ================================================================
    // BATCH TRACING
    // ================================================================

    /**
     * Trace batch: siapa mendapat obat dengan batch/lot tertentu
     */
    public function traceBatch(Request $request, string $medicineId, string $batchNumber): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $result = $this->batchTracingService->traceBatch($tenantId, $medicineId, $batchNumber);
        return $this->successResponse($result);
    }

    /**
     * Pasien yang menerima batch tertentu (untuk identifikasi dampak recall)
     */
    public function getAffectedPatients(Request $request, string $medicineId, string $batchNumber): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $patients = $this->batchTracingService->getAffectedPatients($tenantId, $medicineId, $batchNumber);
        return $this->successResponse(['patients' => $patients]);
    }

    /**
     * Riwayat distribusi satu obat
     */
    public function getMedicineDistributionHistory(Request $request, string $medicineId): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $result = $this->batchTracingService->getMedicineDistributionHistory(
            $tenantId, $medicineId,
            $request->query('start_date'),
            $request->query('end_date')
        );
        return $this->successResponse($result);
    }

    /**
     * Status expiry semua batch aktif di gudang
     */
    public function getBatchExpiryStatus(Request $request, string $warehouseId): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $result = $this->batchTracingService->getBatchExpiryStatus($tenantId, $warehouseId);
        return $this->successResponse(['batches' => $result]);
    }

    // ================================================================
    // RECALL MANAGEMENT
    // ================================================================

    /**
     * Inisiasi recall baru
     */
    public function initiateRecall(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_id' => 'required|uuid',
            'batch_number' => 'nullable|string',
            'recall_type' => 'required|in:bpom_mandatory,manufacturer,internal',
            'recall_class' => 'nullable|in:class_i,class_ii,class_iii',
            'recall_reason' => 'required|string|max:500',
            'recall_detail' => 'nullable|string',
            'action_required' => 'nullable|string',
            'bpom_recall_number' => 'nullable|string',
            'bpom_notification_date' => 'nullable|date',
            'recall_deadline' => 'nullable|date',
        ]);

        $tenantId = auth()->user()->tenant_id;
        $result = $this->recallService->initiateRecall($tenantId, $validated);
        return $this->successResponse($result, 201);
    }

    /**
     * Daftar recall aktif
     */
    public function getActiveRecalls(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $recalls = $this->recallService->getActiveRecalls($tenantId);
        return $this->successResponse(['recalls' => $recalls]);
    }

    /**
     * Laporan detail recall
     */
    public function getRecallReport(string $recallId): JsonResponse
    {
        $report = $this->recallService->getRecallReport($recallId);
        return $this->successResponse($report);
    }

    /**
     * Update status handling dampak recall
     */
    public function updateImpactStatus(Request $request, string $impactId): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:patient_notified,recovered,not_recoverable,pending',
            'quantity_recovered' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $result = $this->recallService->updateImpactStatus(
            $impactId,
            $validated['status'],
            $validated['quantity_recovered'] ?? 0,
            $validated['notes'] ?? null
        );
        return $this->successResponse($result);
    }

    /**
     * Selesaikan recall
     */
    public function completeRecall(Request $request, string $recallId): JsonResponse
    {
        $validated = $request->validate([
            'completion_notes' => 'required|string',
        ]);

        $result = $this->recallService->completeRecall($recallId, $validated['completion_notes']);
        return $this->successResponse($result);
    }

    // ================================================================
    // HIGH ALERT & LASA
    // ================================================================

    /**
     * Klasifikasikan obat sebagai High Alert
     */
    public function classifyHighAlert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_id' => 'required|uuid',
            'alert_level' => 'required|in:high_alert,narcotics,psychotropics,precursor,cytotoxic,look_alike,sound_alike,electrolyte_concentrate',
            'warning_label' => 'nullable|string|max:255',
            'storage_requirement' => 'nullable|string|max:500',
            'dispensing_precaution' => 'nullable|string',
            'double_check_required' => 'boolean',
            'requires_special_storage' => 'boolean',
            'visual_alert_color' => 'nullable|string|max:10',
        ]);

        $tenantId = auth()->user()->tenant_id;
        $result = $this->highAlertService->classifyHighAlert($tenantId, $validated);
        return $this->successResponse($result, 201);
    }

    /**
     * Daftar High Alert
     */
    public function getHighAlertList(Request $request): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $level = $request->query('level');
        $list = $this->highAlertService->getHighAlertList($tenantId, $level);
        return $this->successResponse(['high_alerts' => $list]);
    }

    /**
     * Cek High Alert untuk beberapa obat sekaligus (saat dispensing)
     */
    public function checkHighAlert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_ids' => 'required|array|min:1',
            'medicine_ids.*' => 'uuid',
        ]);

        $tenantId = auth()->user()->tenant_id;
        $result = $this->highAlertService->checkHighAlert($tenantId, $validated['medicine_ids']);
        return $this->successResponse(['alerts' => $result]);
    }

    /**
     * Nonaktifkan High Alert
     */
    public function deactivateHighAlert(string $medicineId): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $result = $this->highAlertService->deactivateHighAlert($tenantId, $medicineId);
        return $this->successResponse($result);
    }

    /**
     * Daftarkan pasangan LASA
     */
    public function registerLASAPair(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_a_id' => 'required|uuid',
            'medicine_b_id' => 'required|uuid|different:medicine_a_id',
            'lasa_type' => 'required|in:look_alike,sound_alike,both',
            'similarity_reason' => 'nullable|string|max:500',
            'requires_tall_man_lettering' => 'boolean',
            'tall_man_lettering_a' => 'nullable|string|max:255',
            'tall_man_lettering_b' => 'nullable|string|max:255',
        ]);

        $tenantId = auth()->user()->tenant_id;
        $result = $this->highAlertService->registerLASAPair($tenantId, $validated);
        return $this->successResponse($result, 201);
    }

    /**
     * Daftar LASA aktif
     */
    public function getLASAList(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;
        $list = $this->highAlertService->getLASAList($tenantId);
        return $this->successResponse(['lasa_pairs' => $list]);
    }

    /**
     * Cek peringatan LASA untuk obat dalam resep (saat dispensing)
     */
    public function checkLASAWarnings(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_ids' => 'required|array|min:1',
            'medicine_ids.*' => 'uuid',
        ]);

        $tenantId = auth()->user()->tenant_id;
        $warnings = $this->highAlertService->checkLASAWarnings($tenantId, $validated['medicine_ids']);
        return $this->successResponse(['warnings' => $warnings]);
    }
}
