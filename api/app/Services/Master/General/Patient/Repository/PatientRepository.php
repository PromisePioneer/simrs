<?php

namespace App\Services\Master\General\Patient\Repository;

use App\Models\Patient;
use App\Services\Master\General\Patient\Interface\PatientRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PatientRepository implements PatientRepositoryInterface
{

    protected Patient $model;

    public function __construct()
    {
        $this->model = new Patient();
    }

    public function baseQuery(array $filters = []): ?object
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
        return $perPage ? $this->baseQuery(filters: $filters)->paginate(perPage: $perPage) : $this->baseQuery(filters: $filters)->get();
    }


    public function findById(string $id): object
    {
        return $this->model->findOrFail(id: $id);
    }


    public function store($data): object
    {
        return $this->model->create(attributes: $data);
    }

    public function update(string $id, array $data)
    {
        $patient = $this->findById(id: $id);
        $patient->fill($data);
        $patient->save();
        return $patient->fresh();
    }


    public function getPatientWithEMR(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model
            ->whereHas('outpatientVisits')
            ->with([
                'outpatientVisits.vitalSign',
                'outpatientVisits.diagnoses',
                'outpatientVisits.procedures',
                'outpatientVisits.prescriptions',
                'outpatientVisits.doctor',
            ]);


        if (!empty($filters['search'])) {
            $query->where('full_name', 'like', '%' . $filters['search'] . '%');
        }


        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }
}
