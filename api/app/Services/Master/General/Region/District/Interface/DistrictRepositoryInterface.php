<?php

namespace App\Services\Master\General\Region\District\Interface;

interface DistrictRepositoryInterface
{
    public function getAllDistricts(array $filters = [], ?int $perPage = null): ?object;

    public function findById(string $id): ?object;

}
