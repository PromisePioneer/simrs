<?php

namespace App\Services\Master\General\Department\Repository;

use App\Models\Department;
use App\Services\Master\General\Department\Interface\DepartmentRepositoryInterface;

class DepartmentRepository implements DepartmentRepositoryInterface
{

    protected Department $model;

    public function __construct()
    {
        $this->model = new Department();

    }

    public function getDepartments(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with(['building', 'department']);

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }


        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }


    public function findById(string $id): object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): object
    {
        $department = $this->model->findOrFail($id);
        $department->fill($data);
        $department->save();

        return $department->fresh();
    }

    public function destroy(string $id): object
    {
        $department = $this->findById($id);
        $department->delete();
        return $department;
    }
}
