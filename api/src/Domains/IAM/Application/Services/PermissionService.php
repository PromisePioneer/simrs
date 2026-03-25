<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Services;

use Domains\IAM\Domain\Repository\PermissionRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class PermissionService extends BaseCrudService
{
    public function __construct(PermissionRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }

    public function getPermissionsByUser(object $user): array
    {
        return $this->repository->getPermissionsByUser($user);
    }

    public function getPermissionByModuleId(string $moduleId): ?object
    {
        return $this->repository->getPermissionByModuleId($moduleId);
    }

    public function removePermissionsFromModule(string $moduleId, array $permissionNames): bool
    {
        return $this->repository->removePermissionsFromModule($moduleId, $permissionNames);
    }
}
