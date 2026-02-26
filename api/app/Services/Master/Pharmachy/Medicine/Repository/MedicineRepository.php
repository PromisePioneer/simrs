<?php

namespace App\Services\Master\Pharmachy\Medicine\Repository;

use App\Models\Medicine;
use App\Services\Master\Pharmachy\Medicine\Interface\MedicineRepositoryInterface;

class MedicineRepository implements MedicineRepositoryInterface
{
    private Medicine $model;

    public function __construct()
    {
        $this->model = new Medicine();
    }

    public function getMedicines(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->with(['tenant', 'category', 'units'])->orderBy('name');

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


    public function findByTenantId(string $tenantId): ?object
    {
        return $this->model->where('tenant_id', $tenantId)->first();
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


    public function findLastSequence(): ?object
    {
        return $this->model->orderByDesc('sequence')->lockForUpdate()->first();
    }


    public function getNextBatchFEFO(object $medicine)
    {

        return $medicine->batches()               // relasi Medicine → MedicineBatch
        ->whereHas('stock', function ($q) {
            $q->where('stock_amount', '>', 0); // hanya batch yang ada stock
        })
            ->with(['stock' => function ($q) {
                $q->where('stock_amount', '>', 0); // eager load stock
            }])
            ->orderBy('expired_date', 'asc')    // FEFO: batch paling cepat expired
            ->first();

    }
}
