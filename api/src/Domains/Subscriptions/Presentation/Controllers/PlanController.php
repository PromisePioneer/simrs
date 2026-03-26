<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Presentation\Controllers;

use App\Traits\ApiResponse;
use Domains\Subscriptions\Application\Services\PlanService;
use Domains\Subscriptions\Presentation\Requests\PlanRequest;
use Domains\Subscriptions\Presentation\Resources\PlanResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class PlanController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly PlanService $planService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search']);
        $perPage = $request->integer('per_page') ?: null;

        $plans = $this->planService->getAll($filters, $perPage);

        return response()->json(PlanResource::collection($plans));
    }

    public function show(string $id): JsonResponse
    {
        $plan = $this->planService->findById($id);

        return response()->json(new PlanResource($plan));
    }

    public function store(PlanRequest $request): JsonResponse
    {
        $plan = $this->planService->store($request->validated());

        return response()->json(new PlanResource($plan), 201);
    }

    public function update(PlanRequest $request, string $id): JsonResponse
    {
        $plan = $this->planService->update($request->validated(), $id);

        return response()->json(new PlanResource($plan));
    }

    public function destroy(string $id): JsonResponse
    {
        $this->planService->delete($id);

        return $this->successResponse(null, 'Plan berhasil dihapus.');
    }

    public function bulkDestroy(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        $this->planService->bulkDelete($ids);

        return $this->successResponse(null, 'Plan berhasil dihapus.');
    }
}
