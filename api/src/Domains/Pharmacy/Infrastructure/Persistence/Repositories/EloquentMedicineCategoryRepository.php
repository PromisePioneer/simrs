<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\MedicineCategoryRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineCategoryModel;

class EloquentMedicineCategoryRepository implements MedicineCategoryRepositoryInterface
{
    public function __construct(private MedicineCategoryModel $model) {}

    public function getCategories(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
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
        $category = $this->findById($id);
        $category->fill($data)->save();
        return $category->fresh();
    }

    public function destroy(string $id): ?object
    {
        $category = $this->findById($id);
        $category->delete();
        return $category;
    }
}
