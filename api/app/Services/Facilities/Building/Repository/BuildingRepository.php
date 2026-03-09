<?php

namespace App\Services\Facilities\Building\Repository;

use App\Models\Building;
use App\Services\Facilities\Building\Interface\BuildingRepositoryInterface;

class BuildingRepository implements BuildingRepositoryInterface
{
    protected Building $model;

    public function __construct()
    {
        $this->model = new Building();
    }

    public function getBuildings(array $filters = [], int $perPage = 10): object
    {
        $query = $this->model->query();

        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
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

    public function update(string $id, array $data): bool
    {
        $record = $this->findById($id);
        return $record->update($data);
    }

    public function destroy(string $id): bool
    {
        return $this->model->destroy($id);
    }
}
