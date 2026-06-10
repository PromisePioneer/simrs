<?php

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\MedicineSupplierRepositoryInterface;
use Illuminate\Http\Request;

class MedicineSupplierService
{
    public function __construct(
        private MedicineSupplierRepositoryInterface $repository,
    )
    {

    }

    public function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }


    public function bulkDelete(array $ids): void
    {
        $this->repository->bulkDelete(ids: $ids);
    }


}
