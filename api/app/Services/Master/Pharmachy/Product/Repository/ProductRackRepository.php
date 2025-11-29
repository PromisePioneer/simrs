<?php

namespace App\Services\Master\Pharmachy\Product\Repository;

use App\Models\ProductRack;
use App\Services\Master\Pharmachy\Product\Interface\ProductRackRepositoryInterface;

class ProductRackRepository implements ProductRackRepositoryInterface
{
    private ProductRack $model;

    public function __construct()
    {
        $this->model = new ProductRack();

    }

    public function getProductRacks(array $filters = [], ?int $perPage = null): ?object
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

    public function findById(string $id): ?object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data = []): ?object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data = []): ?object
    {
        $productRack = $this->model->findOrFail($id);
        $productRack->fill($data);
        $productRack->save();
        return $productRack->fresh();
    }

    public function destroy(string $id): ?object
    {
        $productRack = $this->model->findOrFail($id);
        $productRack->delete();
        return $productRack;
    }
}
