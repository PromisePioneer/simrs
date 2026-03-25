<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\MedicineStockMovementRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineStockMovementModel;

readonly class EloquentMedicineStockMovementRepository implements MedicineStockMovementRepositoryInterface
{
    public function __construct(
        private MedicineStockMovementModel $model,
    )
    {
    }

    public function getStockMovements(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with([
            'medicine:id,name,sku,base_unit',
            'batch:id,batch_number,expired_date',
            'warehouse:id,name',
            'rack:id,name',
        ])->latest();

        if (!empty($filters['search'])) {
            $query->whereHas('medicine', fn($q) => $q->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('sku', 'like', '%' . $filters['search'] . '%')
            );
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['medicine_id'])) {
            $query->where('medicine_id', $filters['medicine_id']);
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function store(
        string     $tenantId,
        string     $medicineId,
        string     $batchId,
        string     $warehouseId,
        ?string    $rackId,
        int|string $beforeStock,
        int|string $stockAfter,
        string     $referenceId,
        int|string $quantity,
        string     $referenceType,
        string     $notes,
    ): object
    {
        return $this->model->create([
            'tenant_id' => $tenantId,
            'medicine_id' => $medicineId,
            'batch_id' => $batchId,
            'warehouse_id' => $warehouseId,
            'rack_id' => $rackId,
            'type' => 'out',
            'quantity' => -abs((int)$quantity),
            'stock_before' => $beforeStock,
            'stock_after' => $stockAfter,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'notes' => $notes,
        ]);
    }
}
