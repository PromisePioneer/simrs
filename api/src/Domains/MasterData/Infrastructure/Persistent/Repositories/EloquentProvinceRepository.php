<?php

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use App\Models\Province;
use Domains\MasterData\Domain\Repository\ProvinceRepositoryInterface;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentProvinceRepository extends BaseEloquentRepository implements ProvinceRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new Province());
    }


    public function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }
}
