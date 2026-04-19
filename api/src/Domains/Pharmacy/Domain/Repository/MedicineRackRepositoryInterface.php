<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Domain\Repository;

interface MedicineRackRepositoryInterface
{
    public function getMedicineRacks(array $filters = [], ?int $perPage = null): ?object;
    public function getUnassignedRacks(array $filters = [], ?int $perPage = null): ?object;
    public function getByWarehouseId(string $id): ?object;
    public function findById(string $id): ?object;
    public function store(array $data): ?object;
    public function update(string $id, array $data): ?object;
    public function destroy(string $id): ?object;
}
