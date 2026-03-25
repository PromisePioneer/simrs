<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\MedicineUnitTypeRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineUnitTypeModel;

class EloquentMedicineUnitTypeRepository implements MedicineUnitTypeRepositoryInterface
{
    public function __construct(private MedicineUnitTypeModel $model) {}

    public function getAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery();

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('code', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(array $data, string $id): object
    {
        $unitType = $this->model->findOrFail($id);
        $unitType->update($data);
        return $unitType->fresh();
    }

    public function delete(string $id): void
    {
        $this->model->findOrFail($id)->delete();
    }
}
