<?php

namespace App\Services\Master\General\Region\Village\Interface;

interface VillageRepositoryInterface
{
    public function getAllVillages(array $filters = [], ?int $perPage = null): ?object;

    public function findById(string $id): ?object;
}
