<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Repositories;

use Domains\Inpatient\Domain\Repository\BedAssignmentRepositoryInterface;
use Domains\Inpatient\Infrastructure\Persistence\Models\BedAssignmentModel;

class EloquentBedAssignmentRepository implements BedAssignmentRepositoryInterface
{
    public function __construct(private BedAssignmentModel $model) {}

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function findCurrentAssignment(string $inpatientAdmissionId): ?object
    {
        return $this->model
            ->where('inpatient_admission_id', $inpatientAdmissionId)
            ->whereNull('released_at')
            ->first();
    }
}
