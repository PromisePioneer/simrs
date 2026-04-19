<?php

declare(strict_types=1);

namespace Domains\Facility\Infrastructure\Persistence\Repositories;

use Domains\Facility\Domain\Repository\WardRepositoryInterface;
use Domains\Facility\Infrastructure\Persistence\Models\WardModel;

class EloquentWardRepository implements WardRepositoryInterface
{
    public function __construct(private WardModel $model) {}

    public function getWards(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with(['rooms', 'department', 'building'])->orderBy('name');

        if (!empty($filters['search'])) {
            $query->whereHas('rooms', fn($q) => $q->where('name', 'like', '%' . $filters['search'] . '%'))
                ->orWhere('name', 'like', '%' . $filters['search'] . '%');
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findById(string $id): ?object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(array $data, string $id): object
    {
        $ward = $this->findById($id);
        $ward->fill($data)->save();
        return $ward->fresh();
    }

    public function destroy(string $id): bool
    {
        return $this->model->delete($id);
    }
}
