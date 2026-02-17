<?php

namespace App\Services\OutpatientVisit\Repository;

use App\Models\OutpatientVisit;
use App\Services\OutpatientVisit\Interface\OutpatientVisitRepositoryInterface;

class OutpatientVisitRepository implements OutpatientVisitRepositoryInterface
{
    protected OutpatientVisit $model;

    public function __construct()
    {
        $this->model = new OutpatientVisit();
    }

    public function getOutpatient(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->with(['patient', 'doctor', 'poli']);

        if (!empty($filters['search'])) {
            $query->whereHas('patient', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            })->orWhereHas('doctor', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            })->orWhereHas('poli', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            });
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

    public function store(array $data): ?object
    {
        return $this->model->create($data);
    }


    public function update(array $data, string $id)
    {
        return $this->findById($id)
            ->fill($data)
            ->save($data)
            ->fresh();
    }


    public function destroy(string $id): int
    {
        return $this->model->destroy($data);
    }
}
