<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Repository;

use Illuminate\Support\Collection;

interface ModuleRepositoryInterface
{
    public function getModules(?string $roleName, object $user, array $userPermissions): Collection;
    public function getPaginated(array $filters = [], int $perPage = 20): object;
    public function findById(string $id): object;
    public function store(array $data): object;
    public function update(string $id, array $data): object;
    public function delete(string $id): void;
    public function deleteWhereNotIn(array $ids): void;
    public function bulkCreate(array $items): void;
    public function bulkUpdate(array $items): void;
    public function getAllWithPermissions(): Collection;
}
