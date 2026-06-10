<?php

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\MasterData\Domain\Repository\DepartmentRepositoryInterface;
use Domains\Pharmacy\Domain\Repository\MedicineSupplierRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineSupplierModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentMedicineSupplierRepository extends BaseEloquentRepository implements MedicineSupplierRepositoryInterface
{


    public function __construct()
    {
        parent::__construct(new MedicineSupplierModel());
    }


    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('description', 'like', '%' . $filters['search'] . '%')
                ->orWhere('phone', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }
}
