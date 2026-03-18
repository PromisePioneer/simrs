<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\MedicineWarehouseRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineWarehouseModel;

class EloquentMedicineWarehouseRepository implements MedicineWarehouseRepositoryInterface
{
    public function __construct(private MedicineWarehouseModel $model) {}

    public function getWarehouses(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with('racks')->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
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
        $warehouse = $this->findById($id);
        $warehouse->fill($data)->save();
        return $warehouse->fresh();
    }

    public function destroy(string $id): object
    {
        $warehouse = $this->findById($id);
        $warehouse->delete();
        return $warehouse;
    }
}
