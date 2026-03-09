<?php

namespace App\Services\Facilities\Building\Service;

use App\Http\Requests\BuildingRequest;
use App\Models\Building;
use App\Services\Facilities\Building\Repository\BuildingRepository;
use Illuminate\Http\Request;

class BuildingService
{

    protected BuildingRepository $buildingRepository;


    public function __construct()
    {
        $this->buildingRepository = new BuildingRepository();
    }

    public function getBuildings(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->buildingRepository->getBuildings(filters: $filters, perPage: $perPage);
    }

    public function store(BuildingRequest $request): object
    {
        $data = $request->validated();
        return $this->buildingRepository->store(data: $data);
    }

    public function update(BuildingRequest $request, Building $building): bool
    {
        $data = $request->validated();
        return $this->buildingRepository->update(id: $building->id, data: $data);
    }


    public function destroy(Building $building): bool
    {
        return $this->buildingRepository->destroy(id: $building->id);
    }
}
