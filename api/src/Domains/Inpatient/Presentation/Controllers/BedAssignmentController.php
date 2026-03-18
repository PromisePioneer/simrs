<?php

declare(strict_types=1);

namespace Domains\Inpatient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Inpatient\Application\Services\BedAssignmentService;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class BedAssignmentController extends Controller
{
    use ApiResponse;

    public function __construct(private BedAssignmentService $bedAssignmentService) {}

    /** @throws Throwable */
    public function transferBed(Request $request, InpatientAdmissionModel $inpatientAdmission): JsonResponse
    {
        $data = $this->bedAssignmentService->transferBed(
            request: $request,
            admission: $inpatientAdmission,
        );
        return $this->successResponse(data: $data, message: 'Bed Transfer success');
    }
}
