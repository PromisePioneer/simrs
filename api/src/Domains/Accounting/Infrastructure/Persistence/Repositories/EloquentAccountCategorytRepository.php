<?php

namespace Domains\Accounting\Infrastructure\Persistence\Repositories;

use Domains\Accounting\Infrastructure\Persistence\Models\AccountCategoryModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentAccountCategorytRepository extends BaseEloquentRepository
{
    public function __construct()
    {
        parent::__construct(new AccountCategoryModel());
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }
        return $query;
    }
}
