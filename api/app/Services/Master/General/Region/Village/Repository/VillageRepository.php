<?php

namespace App\Services\Master\General\Region\Village\Repository;

use App\Models\Village;
use App\Services\Master\General\Region\Village\Interface\VillageRepositoryInterface;

class VillageRepository implements VillageRepositoryInterface
{
    private Village $model;

    public function __construct()
    {
        $this->model = new Village();
    }

    public function getAllVillages(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->query();


        if (!empty($filters['district_id'])) {
            $query->where('district_id', $filters['district_id']);
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }


        return $query->get();
    }

    public function findById(string $id): ?object
    {
        return $this->model->query()->findOrFail($id);
    }
}
