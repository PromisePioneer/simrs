<?php

namespace App\Services\Master\Pharmachy\Product\Repository;

use App\Models\ProductCategory;
use App\Services\Master\Pharmachy\Product\Interface\ProductCategoryRepositoryInterface;

class ProductCategoryRepository implements ProductCategoryRepositoryInterface
{

    private ProductCategory $model;

    public function __construct()
    {
        $this->model = new ProductCategory();
    }

    public function getCategories(array $filters = [], ?int $perPage = null): ?object
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
        $productCategory = $this->findById($id);
        $productCategory->fill($data);
        $productCategory->save();
        return $productCategory->fresh();
    }

    public function destroy(string $id): ?object
    {
        $productCategory = $this->findById($id);
        $productCategory->delete();
        return $productCategory;
    }
}
