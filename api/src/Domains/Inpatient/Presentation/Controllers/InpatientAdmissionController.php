<?php

declare(strict_types=1);

namespace Domains\Inpatient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Inpatient\Application\Services\InpatientAdmissionService;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Domains\Inpatient\Presentation\Requests\InpatientAdmissionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class InpatientAdmissionController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly InpatientAdmissionService $admissionService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->admissionService->getInpatientAdmissions(request: $request);
        return response()->json($data);
    }

    /** @throws Throwable */
    public function store(InpatientAdmissionRequest $request): JsonResponse
    {
        $data = $this->admissionService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Data successfully created');
    }

    public function show(InpatientAdmissionModel $inpatientAdmission): JsonResponse
    {
        $inpatientAdmission->load([
            'doctor',
            'patient' => fn($q) => $q->withoutGlobalScopes(), // ✅ bypass tenant scope
            'bedAssignments.bed',
            'vitalSigns',
        ]);

        $activeBed = $inpatientAdmission->bedAssignments()
            ->with('bed')
            ->whereHas('bed', fn($q) => $q->where('status', 'occupied'))
            ->first();

        $dailyCares = $inpatientAdmission->dailyCares()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'data' => [...$inpatientAdmission->toArray(), 'active_bed' => $activeBed],
            'daily_cares' => $dailyCares,
        ]);
    }

    public function update(InpatientAdmissionRequest $request, InpatientAdmissionModel $inpatientAdmission): JsonResponse
    {
        $data = $this->admissionService->update(data: $request->validated(), admission: $inpatientAdmission);
        return $this->successResponse(data: $data, message: 'Data successfully updated');
    }

    public function destroy(InpatientAdmissionModel $inpatientAdmission): JsonResponse
    {
        $data = $this->admissionService->destroy(admission: $inpatientAdmission);
        return $this->successResponse(data: $data, message: 'Data successfully deleted');
    }
}
