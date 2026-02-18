<?php

namespace App\Services\Master\General\Poli\Repository;

use App\Models\Poli;
use App\Services\Master\General\Poli\Interface\PoliRepositoryInterface;

class PoliRepository implements PoliRepositoryInterface
{


    protected Poli $model;

    public function __construct()
    {
        $this->model = new Poli();
    }

    public function getPoliData(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->orderBy('name');

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
        return $this->model->findOrFail($id);
    }

    public function store(array $data = []): ?object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data = []): ?object
    {
        $poli = $this->findById($id);
        $poli->fill($data);
        $poli->save();
        return $poli->fresh();
    }

    public function destroy(string $id): bool
    {
        return $this->findById($id)->delete();
    }
}
