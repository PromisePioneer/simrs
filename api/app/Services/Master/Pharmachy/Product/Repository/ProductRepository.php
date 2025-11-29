<?php

namespace App\Services\Master\Pharmachy\Product\Repository;

use App\Models\Product;
use App\Services\Master\Pharmachy\Product\Interface\ProductRepositoryInterface;

class ProductRepository implements ProductRepositoryInterface
{
    private Product $model;

    public function __construct()
    {
        $this->model = new Product();
    }

    public function getProducts(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->orderBy('name');

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('sku', 'like', '%' . $filters['search'] . '%');
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
        $product = $this->findById($id);
        $product->fill($data);
        $product->save();
        return $product->fresh();
    }

    public function destroy(string $id): ?object
    {
        $product = $this->findById($id);
        $product->delete();
        return $product;
    }
}
