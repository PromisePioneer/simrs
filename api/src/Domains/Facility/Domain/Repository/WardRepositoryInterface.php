<?php

declare(strict_types=1);

namespace Domains\Facility\Domain\Repository;

interface WardRepositoryInterface
{
    public function getWards(array $filters = [], ?int $perPage = null): object;
    public function findById(string $id): ?object;
    public function store(array $data): object;
    public function update(array $data, string $id): object;
    public function destroy(string $id): bool;
}
