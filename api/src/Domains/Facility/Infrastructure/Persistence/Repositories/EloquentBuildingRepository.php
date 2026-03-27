<?php

declare(strict_types=1);

namespace Domains\Facility\Infrastructure\Persistence\Repositories;

use Domains\Facility\Domain\Repository\BuildingRepositoryInterface;
use Domains\Facility\Infrastructure\Persistence\Models\BuildingModel;

readonly class EloquentBuildingRepository implements BuildingRepositoryInterface
{
    public function __construct(private BuildingModel $model)
    {
    }

    public function getBuildings(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with('wards');

        if (!empty($filters['name'])) {
            $query->where('name', 'like', '%' . $filters['name'] . '%');
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

    public function update(string $id, array $data): bool
    {
        return $this->findById($id)->update($data);
    }

    public function destroy(string $id): bool
    {
        return $this->model->destroy($id);
    }
}
