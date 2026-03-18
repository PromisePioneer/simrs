<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\MedicineRackRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineWarehouseModel;
use Illuminate\Http\Request;

class MedicineRackService
{
    public function __construct(private MedicineRackRepositoryInterface $rackRepository) {}

    public function getMedicineRacks(Request $request): object
    {
        return $this->rackRepository->getMedicineRacks(
            filters: $request->only(['search']),
            perPage: $request->input('per_page'),
        );
    }

    public function getUnassignedRacks(Request $request): object
    {
        return $this->rackRepository->getUnassignedRacks(
            filters: $request->only(['search']),
            perPage: $request->input('per_page'),
        );
    }

    public function store(array $data): ?object
    {
        return $this->rackRepository->store($data);
    }

    public function update(array $data, string $id): ?object
    {
        return $this->rackRepository->update($id, $data);
    }

    public function destroy(string $id): ?object
    {
        return $this->rackRepository->destroy($id);
    }

    public function getByWarehouse(MedicineWarehouseModel $warehouse): ?object
    {
        return $this->rackRepository->getByWarehouseId($warehouse->id);
    }
}
