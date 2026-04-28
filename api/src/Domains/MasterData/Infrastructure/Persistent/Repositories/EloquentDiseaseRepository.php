<?php

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use Domains\MasterData\Domain\Repository\DiseaseRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\DepartmentModel;
use Domains\MasterData\Infrastructure\Persistent\Models\DiseaseModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentDiseaseRepository extends BaseEloquentRepository implements DiseaseRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new DiseaseModel());
    }


    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                ->orWhere('code', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }
}
