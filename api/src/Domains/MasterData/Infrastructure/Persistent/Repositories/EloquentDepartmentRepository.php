<?php

declare(strict_types=1);

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use Domains\MasterData\Domain\Repository\DepartmentRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\DepartmentModel;
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
