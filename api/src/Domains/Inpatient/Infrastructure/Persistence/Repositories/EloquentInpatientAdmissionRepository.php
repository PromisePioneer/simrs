<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Repositories;

use Domains\Inpatient\Domain\Repository\InpatientAdmissionRepositoryInterface;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;

class EloquentInpatientAdmissionRepository implements InpatientAdmissionRepositoryInterface
{
    public function __construct(private InpatientAdmissionModel $model) {}

    public function getInpatientAdmissions(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with([
            'doctor:id,name',
            'patient:id,full_name,medical_record_number',
            'bedAssignments.bed.room.ward',
            'vitalSigns' => fn($q) => $q->latest()->limit(1),
        ]);

        if (!empty($filters['search'])) {
            $query->where('diagnosis', 'like', '%' . $filters['search'] . '%');
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
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
        $record = $this->findById($id);
        $record->fill($data)->save();
        return $record->fresh();
    }

    public function destroy(string $id): object
    {
        $record = $this->model->findOrFail($id);
        $record->delete();
        return $record;
    }
}
