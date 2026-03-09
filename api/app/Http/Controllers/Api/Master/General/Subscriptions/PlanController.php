<?php

namespace App\Http\Controllers\Api\Master\General\Subscriptions;

use App\Http\Controllers\Controller;
use App\Http\Requests\PlanRequest;
use App\Models\Plan;
use App\Services\Master\General\Pricing\Service\PlanService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PlanController extends Controller
{

    use ApiResponse;

    private PlanService $planService;

    public function __construct()
    {
        $this->planService = new PlanService();
    }

    public function index(Request $request)
    {
        $data = $this->planService->getPlans($request);
        return response()->json($data);
    }


    public function store(PlanRequest $request)
    {
        $data = $this->planService->store($request);
        return $this->successResponse($data, 'Plan created successfully.');
    }


    public function show(Plan $plan)
    {
        return response()->json($plan);
    }

    public function update(PlanRequest $request, Plan $plan)
    {
        $data = $this->planService->update($request, $plan);
        return $this->successResponse($data, 'Plan updated successfully.');
    }


    public function destroy(Plan $plan)
    {
        $this->planService->destroy($plan->id);
        return $this->successResponse('Plan deleted successfully.');
    }

    public function bulkDestroy(Plan $plan, Request $request)
    {
        $this->planService->bulkDestroy($plan->id);
        return $this->successResponse('Plan deleted successfully.');
    }

}
