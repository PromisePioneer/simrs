<?php

namespace App\Services\Facilities\Ward\Repository;

use App\Models\Ward;
use App\Services\Facilities\Ward\Interface\WardRepositoryInterface;

class WardRepository implements WardRepositoryInterface
{

    protected Ward $model;


    public function __construct()
    {
        $this->model = new Ward();
    }

    public function getWards(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with(['rooms','department', 'building'])->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }
        return $query->get();
    }

    public function findById(string $id): ?object
    {
        return $this->model->findOrFail(id: $id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(array $data, string $id): object
    {
        $ward = $this->findById($id);
        $ward->fill($data);
        $ward->save();

        return $ward->fresh();
    }

    public function destroy(string $id): bool
    {
        return $this->model->delete($id);
    }
}
