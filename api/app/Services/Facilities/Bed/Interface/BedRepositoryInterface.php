<?php

namespace App\Services\Facilities\Bed\Interface;

interface BedRepositoryInterface
{

    public function getBeds(array $filters = [], ?int $perPage = null): object;

    public function store(array $data): object;

    public function findById(string $id): object;

    public function update(array $data, string $id): object;

    public function destroy(string $id): object;

}
