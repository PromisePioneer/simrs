<?php

namespace App\Services\Master\General\MedicalWork\Repository;

use App\Models\SubSpecialization;
use App\Services\Master\General\MedicalWork\Interface\SubSpecializationRepositoryInterface;

class SubSpecializationRepository implements SubSpecializationRepositoryInterface
{

    private SubSpecialization $model;

    public function __construct()
    {
        $this->model = new SubSpecialization();
    }


    public function baseQuery(array $filters = []): ?object
    {
        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }

    public function getSubSpecializations(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->baseQuery($filters);
        return $this->getAll($query, $perPage);
    }


    public function getAll($query, ?int $perPage = null): ?object
    {
        return $perPage ? $query->paginate($perPage) : $query->get();
    }


    public function getBySpecializations(string $subSpecializationId, array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->baseQuery($filters)->where('specialization_id', $subSpecializationId);
        return $this->getAll($query, $perPage);
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
