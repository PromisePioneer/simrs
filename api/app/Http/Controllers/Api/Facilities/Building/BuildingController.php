<?php

namespace App\Http\Controllers\Api\Facilities\Building;

use App\Http\Controllers\Controller;
use App\Http\Requests\BuildingRequest;
use App\Models\Building;
use App\Services\Facilities\Building\Service\BuildingService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BuildingController extends Controller
{

    use ApiResponse;

    protected BuildingService $buildingService;

    public function __construct()
    {
        $this->buildingService = new BuildingService();
    }


    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', Building::class);
        $data = $this->buildingService->getBuildings(request: $request);
        return response()->json($data);
    }

    public function store(BuildingRequest $request): JsonResponse
    {
        $this->authorize('create', Building::class);
        $data = $this->buildingService->store(request: $request);
        return $this->successResponse(data: $data, message: 'Data berhasil disimpan');
    }


    public function show(Building $building): JsonResponse
    {
        $this->authorize('view', $building);
        return response()->json($building);
    }

    public function update(BuildingRequest $request, Building $building): JsonResponse
    {
        $this->authorize('update', $building);
        $this->buildingService->update(request: $request, building: $building);
        return $this->successResponse(message: 'Data berhasil disimpan');
    }

    public function destroy(Building $building): JsonResponse
    {
        $this->authorize('delete', $building);
        $this->buildingService->destroy(building: $building);
        return $this->successResponse(data: $building, message: 'Data berhasil dihapus');
    }
}
