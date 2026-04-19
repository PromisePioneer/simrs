<?php

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use App\Models\Village;
use Domains\MasterData\Domain\Repository\VillageRepositoryInterface;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentVillageRepository extends BaseEloquentRepository implements VillageRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new Village());
    }

    public function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }
}
