<?php

declare(strict_types=1);

namespace Domains\Inpatient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Inpatient\Application\Services\InpatientDailyMedicationService;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientDailyMedicationModel;
use Domains\Inpatient\Presentation\Requests\InpatientDailyMedicationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class InpatientDailyMedicationController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly InpatientDailyMedicationService $medicationService,
    ) {}

    /**
     * GET /inpatient-admissions/{admission}/daily-medications
     */
    public function index(InpatientAdmissionModel $inpatientAdmission, Request $request): JsonResponse
    {
        $this->authorize('viewAny', InpatientDailyMedicationModel::class);

        $data = $this->medicationService->getByAdmission(
            admissionId: $inpatientAdmission->id,
            request:     $request,
        );

        return response()->json($data);
    }

    /**
     * POST /inpatient-admissions/{admission}/daily-medications
     */
    public function store(
        InpatientAdmissionModel         $inpatientAdmission,
        InpatientDailyMedicationRequest $request,
    ): JsonResponse {
        $this->authorize('create', InpatientDailyMedicationModel::class);

        $data = array_merge($request->validated(), [
            'inpatient_admission_id' => $inpatientAdmission->id,
        ]);

        try {
            $record = $this->medicationService->store($data);
            return $this->successResponse(data: $record, message: 'Resep obat berhasil ditambahkan.');
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * GET /inpatient-admissions/{admission}/daily-medications/{medication}
     */
    public function show(
        InpatientAdmissionModel         $inpatientAdmission,
        InpatientDailyMedicationModel   $dailyMedication,
    ): JsonResponse {
        $this->authorize('view', $dailyMedication);

        return response()->json($this->medicationService->show($dailyMedication->id));
    }

    /**
     * PUT /inpatient-admissions/{admission}/daily-medications/{medication}
     */
    public function update(
        InpatientAdmissionModel         $inpatientAdmission,
        InpatientDailyMedicationRequest $request,
        InpatientDailyMedicationModel   $dailyMedication,
    ): JsonResponse {
        $this->authorize('update', $dailyMedication);

        $record = $this->medicationService->update($request->validated(), $dailyMedication->id);

        return $this->successResponse(data: $record, message: 'Resep obat berhasil diperbarui.');
    }

    /**
     * POST /inpatient-admissions/{admission}/daily-medications/{medication}/dispense
     */
    public function dispense(
        InpatientAdmissionModel       $inpatientAdmission,
        InpatientDailyMedicationModel $dailyMedication,
    ): JsonResponse {
        $this->authorize('dispense', $dailyMedication);

        try {
            $record = $this->medicationService->dispense($dailyMedication->id);
            return $this->successResponse(data: $record, message: 'Obat berhasil diberikan.');
        } catch (Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * POST /inpatient-admissions/{admission}/daily-medications/{medication}/cancel
     */
    public function cancel(
        InpatientAdmissionModel       $inpatientAdmission,
        InpatientDailyMedicationModel $dailyMedication,
    ): JsonResponse {
        $this->authorize('cancel', $dailyMedication);

        try {
            $record = $this->medicationService->cancel($dailyMedication->id);
            return $this->successResponse(data: $record, message: 'Resep obat berhasil dibatalkan.');
        } catch (Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * DELETE /inpatient-admissions/{admission}/daily-medications/{medication}
     */
    public function destroy(
        InpatientAdmissionModel       $inpatientAdmission,
        InpatientDailyMedicationModel $dailyMedication,
    ): JsonResponse {
        $this->authorize('delete', $dailyMedication);

        try {
            $record = $this->medicationService->destroy($dailyMedication->id);
            return $this->successResponse(data: $record, message: 'Resep obat berhasil dihapus.');
        } catch (Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
