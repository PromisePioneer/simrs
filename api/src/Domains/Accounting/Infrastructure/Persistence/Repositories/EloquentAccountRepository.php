<?php

declare(strict_types=1);

namespace Domains\Accounting\Infrastructure\Persistence\Repositories;

use Domains\Accounting\Infrastructure\Persistence\Models\AccountCategoryModel;
use Domains\Accounting\Infrastructure\Persistence\Models\AccountModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentAccountRepository extends BaseEloquentRepository
{
    public function __construct()
    {
        parent::__construct(new AccountModel());
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('code', 'like', '%' . $filters['search'] . '%');
        }
        return $query;
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()
            ->with('children')
            ->whereNull('parent_id')
            ->orderBy('name');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : (object)$query->get();
    }
}
