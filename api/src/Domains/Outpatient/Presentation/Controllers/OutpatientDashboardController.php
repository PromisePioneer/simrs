<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use Domains\Outpatient\Application\Services\OutpatientVisitService;
use Illuminate\Http\JsonResponse;

class OutpatientDashboardController extends Controller
{
    public function __construct(private readonly OutpatientVisitService $service) {}

    public function getTodayPatientCount(): JsonResponse
    {
        return response()->json($this->service->getTodayPatientCount());
    }

    public function getPatientBasedOnStatus(): JsonResponse
    {
        return response()->json($this->service->getPatientBasedOnStatusCount());
    }
}
