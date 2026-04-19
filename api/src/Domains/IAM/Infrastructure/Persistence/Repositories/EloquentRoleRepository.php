<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use Domains\IAM\Domain\Repository\RoleRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;
use Illuminate\Support\Collection;

class EloquentRoleRepository extends BaseEloquentRepository implements RoleRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new RoleModel());
    }


    public function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('type', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }


    public function getByTenant(string $tenantId): Collection
    {
        return RoleModel::where('tenant_id', $tenantId)->orWhere('tenant_id', null)
            ->orderBy('name')
            ->get();
    }
}
