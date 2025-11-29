<?php

namespace App\Services\Master\General\Region\Regency\Interface;

interface RegencyRepositoryInterface
{
    public function getAllRegencies(array $filters = [], ?int $perPage = null): ?object;

    public function findById(string $id): ?object;
}
