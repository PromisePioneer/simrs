<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use Domains\IAM\Domain\Repository\PermissionRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\PermissionModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentPermissionRepository extends BaseEloquentRepository implements PermissionRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new PermissionModel());
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }

    public function getPermissionsByUser(object $user): array
    {
        return $user->getActivePermissions()->pluck('name')->toArray();
    }

    public function getPermissionByModuleId(string $moduleId): ?object
    {
        return (new PermissionModel())->where('module_id', $moduleId)->get();
    }

    public function removePermissionsFromModule(string $moduleId, array $permissionNames): bool
    {
        return (bool) (new PermissionModel())
            ->where('module_id', $moduleId)
            ->whereIn('name', $permissionNames)
            ->delete();
    }
}
