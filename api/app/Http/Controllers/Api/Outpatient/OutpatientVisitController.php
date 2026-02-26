<?php

namespace App\Http\Controllers\Api\Outpatient;

use App\Http\Controllers\Controller;
use App\Http\Requests\OutpatientVisitRequest;
use App\Models\OutpatientVisit;
use App\Services\OutpatientVisit\Service\OutpatientVisitService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class OutpatientVisitController extends Controller
{
    use ApiResponse;

    protected OutpatientVisitService $outpatientVisitService;

    public function __construct()
    {
        $this->outpatientVisitService = new OutpatientVisitService();
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', OutpatientVisit::class);

        $data = $this->outpatientVisitService->getOutpatientVisits($request);
        return response()->json($data);
    }


    /**
     * @throws Throwable
     */
    public function store(OutpatientVisitRequest $request)
    {
        $this->authorize('create', OutpatientVisit::class);

        $data = $this->outpatientVisitService->store($request);
        return $this->successResponse($data, 'Outpatient visit created successfully.');
    }


    public function update(OutpatientVisitRequest $request, OutpatientVisit $outpatientVisit)
    {
        $this->authorize('update', OutpatientVisit::class);

        $data = $this->outpatientVisitService->update($request, $outpatientVisit);
        return $this->successResponse($data, 'Outpatient visit updated successfully.');
    }


    public function show(OutpatientVisit $outpatientVisit)
    {

        $this->authorize('show', OutpatientVisit::class);

        $outpatientVisit->load('patient');
        return response()->json($outpatientVisit);
    }


    public function destroy(OutpatientVisit $outpatientVisit)
    {

        $this->authorize('delete', OutpatientVisit::class);

        $data = $this->outpatientVisitService->destroy($outpatientVisit);
        return $this->successResponse($data, 'Outpatient visit deleted successfully.');
    }
}
