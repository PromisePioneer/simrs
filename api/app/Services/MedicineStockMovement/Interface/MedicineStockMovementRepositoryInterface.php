<?php

namespace App\Services\MedicineStockMovement\Interface;

use App\Models\MedicineStockMovement;

interface MedicineStockMovementRepositoryInterface
{
    public function store(string $tenantId, string $medicineId, string $batchId, string $warehouseId, string $rackId, string $beforeStock, string $stockAfter, string $prescriptionId, string $quantity): object;

}
