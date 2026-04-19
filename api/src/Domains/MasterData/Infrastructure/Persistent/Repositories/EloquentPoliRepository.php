<?php

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use Domains\MasterData\Domain\Repository\PoliRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\PoliModel;
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
