<?php

declare(strict_types=1);

namespace Domains\Facility\Application\Services;

use Domains\Facility\Domain\Repository\BuildingRepositoryInterface;
use Domains\Facility\Infrastructure\Persistence\Models\BuildingModel;
use Illuminate\Http\Request;

class BuildingService
{
    public function __construct(private BuildingRepositoryInterface $buildingRepository) {}

    public function getBuildings(Request $request): object
    {
        $filters  = $request->only(['search']);
        $perPage  = $request->input('per_page');
        return $this->buildingRepository->getBuildings(filters: $filters, perPage: $perPage);
    }

    public function store(array $data): object
    {
        return $this->buildingRepository->store(data: $data);
    }

    public function update(array $data, BuildingModel $building): bool
    {
        return $this->buildingRepository->update(id: $building->id, data: $data);
    }

    public function destroy(BuildingModel $building): bool
    {
        return $this->buildingRepository->destroy(id: $building->id);
    }
}
