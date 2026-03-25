<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\MedicineUnitTypeRepositoryInterface;
use Illuminate\Http\Request;

class MedicineUnitTypeService
{
    public function __construct(
        private MedicineUnitTypeRepositoryInterface $unitTypeRepository
    ) {}

    public function getAll(Request $request): object
    {
        return $this->unitTypeRepository->getAll(
            filters: $request->only(['search']),
            perPage: $request->input('per_page'),
        );
    }

    public function store(array $data): object
    {
        return $this->unitTypeRepository->store($data);
    }

    public function update(array $data, string $id): object
    {
        return $this->unitTypeRepository->update($data, $id);
    }

    public function delete(string $id): void
    {
        $this->unitTypeRepository->delete($id);
    }
}
