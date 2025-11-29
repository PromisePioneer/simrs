<?php

namespace App\Services\Master\General\MedicalWork\Repository;

use App\Models\Specialization;
use App\Models\User;
use App\Services\Master\General\MedicalWork\Interface\SpecializationRepositoryInterface;

class SpecializationRepository implements SpecializationRepositoryInterface
{
    private Specialization $model;

    public function __construct()
    {
        $this->model = new Specialization();
    }


    public function baseQuery(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }

    public function getSpecializations(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->baseQuery($filters);
        return $this->getAll($query, $perPage);
    }


    public function getAll($query, ?int $perPage = null): ?object
    {
        return $perPage ? $query->paginate($perPage) : $query->get();
    }


    public function getByProfession(string $professionId, array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->baseQuery($filters)->where('profession_id', $professionId);
        return $this->getAll($query, $perPage);
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
