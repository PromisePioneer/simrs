<?php

namespace App\Services\Facilities\Building\Interface;

interface BuildingRepositoryInterface
{

    public function getBuildings(array $filters = [], int $perPage = 10): object;

    public function findById(string $id): object;

    public function store(array $data): object;

    public function update(string $id, array $data): bool;

    public function destroy(string $id): bool;
}
