<?php

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use Domains\IAM\Domain\Repository\PoliRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\PoliModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentPoliRepository extends BaseEloquentRepository implements PoliRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new PoliModel());
    }


    public function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }
}
