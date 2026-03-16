<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use Domains\IAM\Domain\Repository\DepartmentRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\DepartmentModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentDepartmentRepository extends BaseEloquentRepository implements DepartmentRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new DepartmentModel());
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }
}
