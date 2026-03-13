<?php

namespace App\Services\Inpatient\Admission\Repository;

use App\Models\InpatientAdmission;
use App\Services\Inpatient\Admission\Interface\InpatientAdmissionRepositoryInterface;

class InpatientAdmissionRepository implements InpatientAdmissionRepositoryInterface
{

    protected InpatientAdmission $model;

    public function __construct()
    {
        $this->model = new InpatientAdmission();
    }

    public function getInpatientAdmissions(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with([
            'doctor:id,name',
            'patient:id,full_name',
            'bedAssignment.bed.room',
            'vitalSigns' => fn($q) => $q->latest()->limit(1), // ✅ hanya terbaru
        ]);


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
