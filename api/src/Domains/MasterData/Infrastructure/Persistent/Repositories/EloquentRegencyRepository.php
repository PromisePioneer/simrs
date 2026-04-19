<?php

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use App\Models\Regency;
use Domains\MasterData\Domain\Repository\RegencyRepositoryInterface;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentRegencyRepository extends BaseEloquentRepository implements RegencyRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new Regency());
    }


    public function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }
}
