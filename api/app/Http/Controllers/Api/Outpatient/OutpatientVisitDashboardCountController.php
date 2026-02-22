<?php

namespace App\Http\Controllers\Api\Outpatient;

use App\Http\Controllers\Controller;
use App\Services\OutpatientVisit\Service\OutpatientVisitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutpatientVisitDashboardCountController extends Controller
{
    protected OutpatientVisitService $outpatientVisitService;

    public function __construct()
    {
        $this->outpatientVisitService = new OutpatientVisitService();
    }

    public function getTodayPatientCount(): JsonResponse
    {
        $data = $this->outpatientVisitService->getTodayPatientCount();
        return response()->json($data);
    }

    public function getPatientBasedOnStatus(Request $request): JsonResponse
    {
        $data = $this->outpatientVisitService->getPatientBasedOnStatusCount(request: $request);
        return response()->json($data);
    }
}
