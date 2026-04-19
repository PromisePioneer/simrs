<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Repositories;

use Domains\Inpatient\Domain\Repository\InpatientDailyCareRepositoryInterface;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientDailyCareModel;

readonly class EloquentInpatientDailyCareRepository implements InpatientDailyCareRepositoryInterface
{
    public function __construct(private InpatientDailyCareModel $model) {}

    public function getByAdmission(string $admissionId, array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model
            ->with(['doctor:id,name'])
            ->where('inpatient_admission_id', $admissionId)
            ->orderByDesc('created_at');

        if (!empty($filters['search'])) {
            $query->where('notes', 'like', '%' . $filters['search'] . '%');
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->with(['doctor', 'inpatientAdmission'])->findOrFail($id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(array $data, string $id): object
    {
        $record = $this->model->findOrFail($id);
        $record->fill($data)->save();
        return $record->fresh(['doctor']);
    }

    public function destroy(string $id): object
    {
        $record = $this->model->findOrFail($id);
        $record->delete();
        return $record;
    }
}
