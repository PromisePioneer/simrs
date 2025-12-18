<?php

namespace App\Services\Master\General\RegistrationInstitution\Repository;

use App\Models\RegistrationInstitution;
use App\Services\Master\General\RegistrationInstitution\Interface\RegistrationInstitutionRepositoryInterface;
use Illuminate\Support\Facades\DB;

class RegistrationInstitutionRepository implements RegistrationInstitutionRepositoryInterface
{


    private RegistrationInstitution $model;

    public function __construct()
    {
        $this->model = new RegistrationInstitution();
    }

    public function getAllRegistrationInstitutes(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->orderBy('name');

        if (!empty($filters['search'])) {
            $query->where(DB::raw('LOWER(name)'), 'like', '%' . $filters['search'] . '%')
                ->orWhere(DB::raw('LOWER(type)'), 'like', '%' . $filters['search'] . '%');
        }


        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
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

    public function update(string $id, array $data = []): object
    {
        $institutes = $this->model->findOrFail($id);
        $institutes->fill($data);
        $institutes->save();
        return $institutes->fresh();
    }

    public function destroy(string $id): ?object
    {
        $institutes = $this->model->findOrFail($id);
        $institutes->delete();
        return $institutes;
    }
}
