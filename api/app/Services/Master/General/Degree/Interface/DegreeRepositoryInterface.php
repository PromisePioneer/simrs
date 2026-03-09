<?php

namespace App\Services\Master\General\Degree\Interface;

interface DegreeRepositoryInterface
{
    public function getDegrees(array $filters = [], ?int $perPage = null): object;

    public function findById(string $id);

    public function store(array $data = []): object;

    public function update(string $id, array $data = []): object;

    public function destroy(string $id);
}
