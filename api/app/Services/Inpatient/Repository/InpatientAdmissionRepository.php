<?php

namespace App\Services\Inpatient\Repository;

use App\Models\InpatientAdmission;
use App\Services\Inpatient\Interface\InpatientAdmissionRepositoryInterface;

class InpatientAdmissionRepository implements InpatientAdmissionRepositoryInterface
{

    protected InpatientAdmission $model;

    public function __construct()
    {
        $this->model = new InpatientAdmission();
    }

    public function getInpatientAdmissions(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with(['doctor', 'patient', 'bedAssignments.bed', 'vitalSigns']);

        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(array $data, string $id): object
    {
        $inpatientAdmission = $this->findById($id);
        $inpatientAdmission->fill($data);
        $inpatientAdmission->save();

        return $inpatientAdmission->fresh();
    }

    public function destroy(string $id): object
    {
        $inpatientAdmission = $this->model->findOrFail($id);
        $inpatientAdmission->delete();
        return $inpatientAdmission;
    }
}
