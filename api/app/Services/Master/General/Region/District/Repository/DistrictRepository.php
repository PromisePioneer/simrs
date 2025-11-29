<?php

namespace App\Services\Master\General\Region\District\Repository;

use App\Models\District;
use App\Services\Master\General\Region\District\Interface\DistrictRepositoryInterface;

class DistrictRepository implements DistrictRepositoryInterface
{
    private District $model;

    public function __construct()
    {
        $this->model = new District();
    }

    public function getAllDistricts(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->orderBy('name');

        if (!empty($filters['regency_id'])) {
            $query->where('regency_id', $filters['regency_id']);
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
        return $this->model->findOrFail($id);
    }
}
