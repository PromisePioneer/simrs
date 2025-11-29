<?php

namespace App\Services\Master\General\Pricing\Service;

use App\Http\Requests\PlanRequest;
use App\Models\Plan;
use App\Services\Master\General\Pricing\Repository\PlanRepository;
use Illuminate\Http\Request;

class PlanService
{

    private PlanRepository $planRepository;

    public function __construct()
    {
        $this->planRepository = new PlanRepository();
    }

    public function getPlans(Request $request)
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->planRepository->getAll(
            filters: $filters,
            perPage: $perPage
        );
    }


    public function store(PlanRequest $request)
    {
        $data = $request->validated();
        return $this->planRepository->store(
            data: $data
        );
    }


    public function update(PlanRequest $request, Plan $plan)
    {
        $data = $request->validated();
        return $this->planRepository->update(
            id: $plan->id,
            data: $data
        );
    }


    public function destroy(string $id): bool
    {
        return $this->planRepository->destroy($id);
    }


    public function bulkDestroy(Request $request): bool
    {
        $ids = $request->input('ids');
        return $this->planRepository->bulkDestroy(ids: $ids);
    }
}
