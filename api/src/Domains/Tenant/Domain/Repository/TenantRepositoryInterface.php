<?php

declare(strict_types=1);

namespace Domains\Tenant\Domain\Repository;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface TenantRepositoryInterface
{
    public function getTenants(array $filters, ?int $perPage = null): Collection|LengthAwarePaginator;

    public function findById(string $id): object;

    public function store(array $data): object;

    public function update(string $id, array $data): object;

    public function delete(string $id): void;
}
