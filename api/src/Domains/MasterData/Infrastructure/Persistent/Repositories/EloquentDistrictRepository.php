<?php

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use App\Models\District;
use Domains\MasterData\Domain\Repository\DistrictRepositoryInterface;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentDistrictRepository extends BaseEloquentRepository implements DistrictRepositoryInterface
{


    public function __construct()
    {
        parent::__construct(new District());
    }


    public function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }
        return $query;
    }

}
