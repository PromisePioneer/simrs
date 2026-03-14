<?php

namespace App\Http\Controllers\Api\Inpatient\BedAssignment;

use App\Http\Controllers\Controller;
use App\Models\InpatientAdmission;
use App\Services\Inpatient\BedAssignment\Service\BedAssignmentService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Throwable;

class BedAssignmentController extends Controller
{

    use ApiResponse;

    protected BedAssignmentService $bedAssignmentService;

    public function __construct()
    {
        $this->bedAssignmentService = new BedAssignmentService();
    }


    /**
     * @throws Throwable
     */
    public function transferBed(Request $request, InpatientAdmission $inpatientAdmission)
    {
        $data = $this->bedAssignmentService->transferBed(request: $request, inpatientAdmission: $inpatientAdmission);
        return $this->successResponse(data: $data, message: "Bed Transfer success");
    }
}
