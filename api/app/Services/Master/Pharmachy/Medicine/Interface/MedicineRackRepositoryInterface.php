<?php

namespace App\Services\Master\Pharmachy\Medicine\Interface;

interface MedicineRackRepositoryInterface
{
    public function getMedicineRacks(array $filters = [], ?int $perPage = null): ?object;

    public function getUnassignedRacks(array $filters = [], ?int $perPage = null): ?object;

    public function findById(string $id): ?object;

    public function store(array $data = []): ?object;

    public function update(string $id, array $data = []): ?object;

    public function destroy(string $id): ?object;


    public function getByWarehouseId(string $id): ?object;
}
