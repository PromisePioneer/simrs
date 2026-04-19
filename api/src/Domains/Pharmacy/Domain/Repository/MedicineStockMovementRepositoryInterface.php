<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Domain\Repository;

interface MedicineStockMovementRepositoryInterface
{
    public function getStockMovements(array $filters = [], ?int $perPage = null): object;

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
    ): object;
}
