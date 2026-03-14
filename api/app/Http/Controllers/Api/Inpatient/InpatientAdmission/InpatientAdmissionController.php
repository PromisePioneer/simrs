<?php

namespace App\Http\Controllers\Api\Inpatient\InpatientAdmission;

use App\Http\Controllers\Controller;
use App\Http\Requests\InpatientAdmissionRequest;
use App\Models\InpatientAdmission;
use App\Services\Inpatient\Admission\Service\InpatientAdmissionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class InpatientAdmissionController extends Controller
{
    use ApiResponse;

    protected InpatientAdmissionService $inpatientAdmissionService;

    public function __construct()
    {
        $this->inpatientAdmissionService = new InpatientAdmissionService();
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->inpatientAdmissionService->getInpatientAdmissions(request: $request);
        return response()->json($data);
    }


    /**
     * @throws Throwable
     */
    public function store(InpatientAdmissionRequest $request): JsonResponse
    {
        $data = $this->inpatientAdmissionService->store(request: $request);
        return $this->successResponse(data: $data, message: "Data successfully created");
    }


    public function show(InpatientAdmission $inpatientAdmission): JsonResponse
    {
        $inpatientAdmission->load('doctor');
        $inpatientAdmission->load('patient');
        $inpatientAdmission->load('bedAssignments.bed');
        $inpatientAdmission->load('vitalSigns');

        $activeBed = $inpatientAdmission->bedAssignments()->with('bed')
            ->whereHas('bed', function ($q) {
                $q->where('status', 'occupied');
            })->first();

        $data = [
            ...$inpatientAdmission->toArray(),
            'active_bed' => $activeBed,
        ];


        $dailyCares = $inpatientAdmission->dailyCares()->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'data' => $data,
            'daily_cares' => $dailyCares,
        ]);
    }

    public function update(InpatientAdmissionRequest $request, InpatientAdmission $inpatientAdmission): JsonResponse
    {
        $data = $this->inpatientAdmissionService->update(request: $request, inpatientAdmission: $inpatientAdmission);
        return $this->successResponse(data: $data, message: "Data successfully updated");
    }


    public function destroy(InpatientAdmission $inpatientAdmission): JsonResponse
    {
        $data = $this->inpatientAdmissionService->destroy($inpatientAdmission);
        return $this->successResponse(data: $data, message: "Data successfully deleted");
    }

}
