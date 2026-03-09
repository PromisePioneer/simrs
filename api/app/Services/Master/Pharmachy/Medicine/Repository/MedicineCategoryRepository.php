<?php

namespace App\Services\Master\Pharmachy\Medicine\Repository;

use App\Models\MedicineCategory;
use App\Services\Master\Pharmachy\Medicine\Interface\MedicineCategoryRepositoryInterface;

class MedicineCategoryRepository implements MedicineCategoryRepositoryInterface
{

    private MedicineCategory $model;

    public function __construct()
    {
        $this->model = new MedicineCategory();
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
