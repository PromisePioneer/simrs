<?php

namespace App\Http\Controllers\Api\Outpatient;

use App\Http\Requests\OutpatientVisitRequest;
use App\Models\OutpatientVisit;
use App\Models\Patient;
use App\Services\OutpatientVisit\Service\OutpatientVisitService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutpatientVisitController
{
    use ApiResponse;

    protected OutpatientVisitService $outpatientVisitService;

    public function __construct()
    {
        $this->outpatientVisitService = new OutpatientVisitService();
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->outpatientVisitService->getOutpatientVisits($request);
        return response()->json($data);
    }


    public function store(OutpatientVisitRequest $request)
    {
        $data = $this->outpatientVisitService->store($request);
        return $this->successResponse($data, 'Outpatient visit created successfully.');
    }


    public function update(OutpatientVisitRequest $request, OutpatientVisit $outpatientVisit)
    {
        $data = $this->outpatientVisitService->update($request, $outpatientVisit);
        return $this->successResponse($data, 'Outpatient visit updated successfully.');
    }


    public function destroy(Patient $patient)
    {
        $data = $this->outpatientVisitService->destroy($patient);
        return $this->successResponse($data, 'Outpatient visit deleted successfully.');
    }
}
