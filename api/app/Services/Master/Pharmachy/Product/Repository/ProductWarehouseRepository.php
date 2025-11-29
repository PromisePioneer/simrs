<?php

namespace App\Services\Master\Pharmachy\Product\Repository;

use App\Models\ProductWarehouse;
use App\Services\Master\Pharmachy\Product\Interface\ProductWarehouseRepositoryInterface;

class ProductWarehouseRepository implements ProductWarehouseRepositoryInterface
{

    private ProductWarehouse $model;

    public function __construct()
    {
        $this->model = new ProductWarehouse();
    }

    public function getWarehouses($filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('code', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): ?object
    {
        // TODO: Implement findById() method.
    }

    public function store(array $data = []): ?object
    {
        // TODO: Implement store() method.
    }

    public function update(string $id, array $data = []): ?object
    {
        // TODO: Implement update() method.
    }

    public function destroy(string $id): ?object
    {
        // TODO: Implement destroy() method.
    }
}
