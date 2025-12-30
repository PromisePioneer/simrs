<?php

namespace App\Services\Master\General\Patient\Repository;

use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientRepository
{

    protected Patient $model;

    public function __construct()
    {
        $this->model = new Patient();
    }

    public function baseQuery(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->orderBy('created_at', 'DESC');

        if (!empty($filters['search'])) {
            $query = $query
                ->where('full_name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('phone', 'like', '%' . $filters['search'] . '%')
                ->orWhere('email', 'like', '%' . $filters['search'] . '%');
        }


        return $query;
    }


    public function getAll(array $filters = [], ?int $perPage = null): ?object
    {
        return $perPage ? $this->baseQuery($filters)->paginate($perPage) : $this->baseQuery($filters)->get();
    }


    public function findById(string $id): object
    {
        return $this->model->findOrFail($id);
    }


    public function store($data): object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data)
    {
        $patient = $this->findById($id);
        $patient->fill($data);
        $patient->save();
        return $patient->fresh();
    }
}
