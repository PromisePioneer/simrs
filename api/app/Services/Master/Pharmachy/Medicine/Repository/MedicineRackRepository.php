<?php

namespace App\Services\Master\Pharmachy\Medicine\Repository;

use App\Models\MedicineRack;
use App\Services\Master\Pharmachy\Medicine\Interface\MedicineRackRepositoryInterface;

class MedicineRackRepository implements MedicineRackRepositoryInterface
{
    private MedicineRack $model;

    public function __construct()
    {
        $this->model = new MedicineRack();

    }

    public function getMedicineRacks(array $filters = [], ?int $perPage = null): ?object
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
