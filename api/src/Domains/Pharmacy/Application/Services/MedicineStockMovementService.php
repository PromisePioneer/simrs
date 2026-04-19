<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\MedicineStockMovementRepositoryInterface;
use Illuminate\Http\Request;

readonly class MedicineStockMovementService
{
    public function __construct(
        private MedicineStockMovementRepositoryInterface $stockMovementRepository,
    )
    {
    }

    public function getStockMovements(Request $request): object
    {
        return $this->stockMovementRepository->getStockMovements(
            filters: $request->only(['search', 'type', 'medicine_id']),
            perPage: (int)$request->input('per_page') ?: null,
        );
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
        return $this->stockMovementRepository->store(
            tenantId: $tenantId,
            medicineId: $medicineId,
            batchId: $batchId,
            warehouseId: $warehouseId,
            rackId: $rackId,
            beforeStock: $beforeStock,
            stockAfter: $stockAfter,
            referenceId: $referenceId,
            quantity: $quantity,
            referenceType: $referenceType,
            notes: $notes,
        );
    }
}
