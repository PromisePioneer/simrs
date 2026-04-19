<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Repository;

use Domains\IAM\Domain\Entities\User;
use Domains\IAM\Domain\Exceptions\UserNotFoundException;

interface UserRepositoryInterface
{
    public function save(User $user, string $hashedPassword): void;

    public function update(User $user): void;

    public function delete(string $id): void;

    /**
     * @throws UserNotFoundException
     */
    public function findById(string $id): User;

    public function findAll(?string $tenantId, array $filters = [], ?int $perPage = null, ?string $role = null): object;

    public function countByTenant(string $tenantId): int;

    public function emailExists(string $email, ?string $excludeId = null): bool;
}
