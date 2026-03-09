<?php

namespace App\Services\Facilities\Ward\Interface;

use App\Models\Ward;

interface WardRepositoryInterface
{
    public function getWards(array $filters = [], ?int $perPage = null): object;

    public function findById(string $id): ?object;

    public function store(array $data): object;

    public function update(array $data, string $id): object;

    public function destroy(string $id): bool;
}
