<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Domain\Repository;

interface MedicineUnitTypeRepositoryInterface
{
    public function getAll(array $filters = [], ?int $perPage = null): object;
    public function findById(string $id): object;
    public function store(array $data): object;
    public function update(array $data, string $id): object;
    public function delete(string $id): void;
}
