<?php

namespace App\Services\Master\General\Region\Province\Repository;

use App\Models\Province;
use App\Services\Master\General\Region\Province\Interface\ProvinceRepositoryInterface;

class ProvinceRepository implements ProvinceRepositoryInterface
{

    private Province $model;

    public function __construct()
    {
        $this->model = new Province();
    }

    public function getProvinces($filters = [], $perPage = 20): ?object
    {
        $query = $this->model->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }


        if ($perPage) {
            return $query->paginate($perPage);
        }
        return $query->get();
    }
}
