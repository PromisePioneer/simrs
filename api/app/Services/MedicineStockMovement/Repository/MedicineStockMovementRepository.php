<?php

namespace App\Services\MedicineStockMovement\Repository;

use App\Models\MedicineStockMovement;
use App\Models\Prescription;
use App\Services\MedicineStockMovement\Interface\MedicineStockMovementRepositoryInterface;

class MedicineStockMovementRepository implements MedicineStockMovementRepositoryInterface
{


    protected MedicineStockMovement $model;

    public function __construct()
    {
        $this->model = new MedicineStockMovement();
    }


    public function getStockMovements(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with([
            'medicine',
            'batch',
            'warehouse',
            'rack'
        ]);

        if (!empty($filters['search'])) {
            $query->whereHas('medicine', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('sku', 'like', '%' . $filters['search'] . '%');
            });
        }


        if ($perPage) {
            return $query->paginate($perPage);
        }


        return $query->get();
    }

    public function store(
        string $tenantId,
        string $medicineId,
        string $batchId,
        string $warehouseId,
        string $rackId,
        string $beforeStock,
        string $stockAfter,
        string $prescriptionId,
        string $quantity
    ): object
    {
        return $this->model->create([
            'tenant_id' => $tenantId,
            'medicine_id' => $medicineId,
            'batch_id' => $batchId,           // wajib diisi
            'warehouse_id' => $warehouseId,   // wajib diisi
            'rack_id' => $rackId,             // opsional
            'type' => 'out',
            'quantity' => -$quantity,
            'stock_before' => $beforeStock,
            'stock_after' => $stockAfter,
            'reference_type' => Prescription::class,
            'reference_id' => $prescriptionId,
            'notes' => 'Dispensed for prescription ID: ' . $prescriptionId,
        ]);
    }
}
