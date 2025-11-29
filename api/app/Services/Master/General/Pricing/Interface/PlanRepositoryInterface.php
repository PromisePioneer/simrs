<?php

namespace App\Services\Master\General\Pricing\Interface;

interface PlanRepositoryInterface
{
    public function baseQuery(array $filters = []): object;


    public function getAll(array $filters = [], ?int $perPage = null): object;


    public function findById(string $id): ?object;

    public function findByName(string $name): ?object;

    public function store(array $data = []): object;

    public function update(string $id, array $data = []): object;


    public function destroy(string $id): bool;
}
