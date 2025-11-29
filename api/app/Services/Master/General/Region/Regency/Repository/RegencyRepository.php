<?php

namespace App\Services\Master\General\Region\Regency\Repository;

use App\Models\Regency;
use App\Services\Master\General\Region\Regency\Interface\RegencyRepositoryInterface;

class RegencyRepository implements RegencyRepositoryInterface
{
    private Regency $model;

    public function __construct()
    {
        $this->model = new Regency();
    }

    public function getAllRegencies(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->orderBy('name');

        if (!empty($filters['province_id'])) {
            $query->where('province_id', $filters['province_id']);
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
