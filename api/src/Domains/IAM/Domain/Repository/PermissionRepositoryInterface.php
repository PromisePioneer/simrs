<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Repository;

use Domains\Shared\Domain\Repository\BaseRepositoryInterface;

interface PermissionRepositoryInterface extends BaseRepositoryInterface
{
    public function getPermissionsByUser(object $user): array;
    public function getPermissionByModuleId(string $moduleId): ?object;
    public function removePermissionsFromModule(string $moduleId, array $permissionNames): bool;
}
