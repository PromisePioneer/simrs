<?php

namespace App\Services\Master\General\MedicalWork\Repository;

use App\Models\Profession;
use App\Services\Master\General\MedicalWork\Interface\ProfessionRepositoryInterface;

class ProfessionRepository implements ProfessionRepositoryInterface
{
    private Profession $model;

    public function __construct()
    {
        $this->model = new Profession();
    }

    public function getProfessions(array $filters = [], ?int $perPage = null): ?object
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
        return $this->model->find($id);
    }

    public function store(array $data = []): ?object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data = []): ?object
    {
        $profession = $this->findById($id);
        $profession->fill($data);
        $profession->save();
        return $profession->fresh();
    }

    public function destroy(string $id): bool
    {
        $profession = $this->findById($id);
        return $profession->delete();
    }
}
