<?php

declare(strict_types=1);

namespace Domains\Facility\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Facility\Application\Services\BuildingService;
use Domains\Facility\Infrastructure\Persistence\Models\BuildingModel;
use Domains\Facility\Presentation\Requests\BuildingRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly BuildingService $buildingService
    )
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', BuildingModel::class);
        $data = $this->buildingService->getBuildings(request: $request);
        return response()->json($data);
    }

    public function store(BuildingRequest $request): JsonResponse
    {
        $this->authorize('create', BuildingModel::class);
        $data = $this->buildingService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Data berhasil disimpan');
    }

    public function show(BuildingModel $building): JsonResponse
    {
        $this->authorize('view', $building);
        return response()->json($building);
    }

    public function update(BuildingRequest $request, BuildingModel $building): JsonResponse
    {
        $this->authorize('update', $building);
        $this->buildingService->update(data: $request->validated(), building: $building);
        return $this->successResponse(message: 'Data berhasil disimpan');
    }

    public function destroy(BuildingModel $building): JsonResponse
    {
        $this->authorize('delete', $building);
        $this->buildingService->destroy(building: $building);
        return $this->successResponse(data: $building, message: 'Data berhasil dihapus');
    }
}
