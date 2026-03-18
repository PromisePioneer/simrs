<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Domain\Repository;

interface MedicineBatchRepositoryInterface
{
    public function getBatches(string $medicineId, array $filters = [], ?int $perPage = null): ?object;
    public function findById(string $id): object;
    public function store(array $data): object;
    public function update(array $data, string $id): object;
    public function findLastSequence(string $medicineId): ?object;
}
