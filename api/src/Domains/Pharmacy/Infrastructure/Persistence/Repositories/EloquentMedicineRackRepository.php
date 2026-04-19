<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\MedicineRackRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineRackModel;

class EloquentMedicineRackRepository implements MedicineRackRepositoryInterface
{
    public function __construct(private MedicineRackModel $model) {}

    public function getMedicineRacks(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->with('warehouse')->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function getUnassignedRacks(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->whereNull('warehouse_id')->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function getByWarehouseId(string $id): ?object
    {
        return $this->model->where('warehouse_id', $id)->get();
    }

    public function findById(string $id): ?object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data): ?object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): ?object
    {
        $rack = $this->findById($id);
        $rack->fill($data)->save();
        return $rack->fresh();
    }

    public function destroy(string $id): ?object
    {
        $rack = $this->findById($id);
        $rack->delete();
        return $rack;
    }
}
