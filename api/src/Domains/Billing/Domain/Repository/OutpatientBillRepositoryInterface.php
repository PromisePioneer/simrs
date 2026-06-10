<?php

declare(strict_types=1);

namespace Domains\Billing\Domain\Repository;

interface OutpatientBillRepositoryInterface
{
    public function findById(string $id): ?object;

    public function findAll(array $filters = [], ?int $perPage = null): object;

    public function store(array $data): object;

    public function update(string $id, array $data): object;

    public function delete(string $id): bool;

    public function getPaginated(array $filters = [], int $perPage = 20): object;
}
