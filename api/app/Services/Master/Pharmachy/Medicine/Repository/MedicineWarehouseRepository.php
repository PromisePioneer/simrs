<?php

namespace App\Services\Master\Pharmachy\Medicine\Repository;

use App\Models\MedicineWarehouse;
use App\Services\Master\Pharmachy\Medicine\Interface\MedicineWarehouseRepositoryInterface;
use Illuminate\Support\Facades\DB;

class MedicineWarehouseRepository implements MedicineWarehouseRepositoryInterface
{

    private MedicineWarehouse $model;

    public function __construct()
    {
        $this->model = new MedicineWarehouse();
    }

    public function getWarehouses($filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->with('racks')->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where(DB::raw('LOWER(name)'), 'like', '%' . strtolower($filters['search']) . '%')
                ->orWhere(DB::raw('LOWER(code)'), 'like', '%' . strtolower($filters['search']) . '%');
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
        return DB::transaction(function () use ($id, $data) {
            $warehouse = $this->findById($id);
            $warehouse->fill($data);
            $warehouse->save();

            if (!empty($data['racks'])) {
                // Delete existing racks
                $warehouse->racks()->delete();

                // Create new racks
                $warehouse->racks()->createMany($data['racks']);
            }

            return $warehouse->fresh(['racks']);
        });
    }

    public function destroy(string $id): ?object
    {
        $warehouse = $this->findById($id);
        $warehouse->delete();
        return $warehouse;
    }
}
