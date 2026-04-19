<?php

declare(strict_types=1);

namespace Domains\Inpatient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Inpatient\Application\Services\InpatientDailyCareService;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientDailyCareModel;
use Domains\Inpatient\Presentation\Requests\InpatientDailyCareRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class InpatientDailyCareController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly InpatientDailyCareService $dailyCareService,
    ) {}

    /**
     * GET /inpatient-admissions/{admission}/daily-cares
     */
    public function index(InpatientAdmissionModel $inpatientAdmission, Request $request): JsonResponse
    {
        $data = $this->dailyCareService->getByAdmission(
            admissionId: $inpatientAdmission->id,
            request:     $request,
        );

        return response()->json($data);
    }

    /**
     * POST /inpatient-admissions/{admission}/daily-cares
     */
    public function store(
        InpatientAdmissionModel    $inpatientAdmission,
        InpatientDailyCareRequest  $request,
    ): JsonResponse {
        $data = array_merge($request->validated(), [
            'inpatient_admission_id' => $inpatientAdmission->id,
            'recorded_at'            => $request->input('recorded_at') ?? now(),
        ]);

        $record = $this->dailyCareService->store($data);

        return $this->successResponse(data: $record, message: 'Catatan perawatan berhasil ditambahkan.');
    }

    /**
     * PUT /inpatient-admissions/{admission}/daily-cares/{dailyCare}
     */
    public function update(
        InpatientAdmissionModel   $inpatientAdmission,
        InpatientDailyCareRequest $request,
        InpatientDailyCareModel   $dailyCare,
    ): JsonResponse {
        try {
            $record = $this->dailyCareService->update($request->validated(), $dailyCare->id);
            return $this->successResponse(data: $record, message: 'Catatan perawatan berhasil diperbarui.');
        } catch (Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * DELETE /inpatient-admissions/{admission}/daily-cares/{dailyCare}
     */
    public function destroy(
        InpatientAdmissionModel $inpatientAdmission,
        InpatientDailyCareModel $dailyCare,
    ): JsonResponse {
        try {
            $record = $this->dailyCareService->destroy($dailyCare->id);
            return $this->successResponse(data: $record, message: 'Catatan perawatan berhasil dihapus.');
        } catch (Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
