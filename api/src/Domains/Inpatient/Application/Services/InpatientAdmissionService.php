<?php

declare(strict_types=1);

namespace Domains\Inpatient\Application\Services;

use Domains\Facility\Domain\Repository\BedRepositoryInterface;
use Domains\Inpatient\Domain\Repository\BedAssignmentRepositoryInterface;
use Domains\Inpatient\Domain\Repository\InpatientAdmissionRepositoryInterface;
use Domains\Inpatient\Domain\Repository\InpatientVitalSignRepositoryInterface;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

readonly class InpatientAdmissionService
{
    public function __construct(
        private InpatientAdmissionRepositoryInterface $admissionRepository,
        private BedRepositoryInterface                $bedRepository,
        private BedAssignmentRepositoryInterface      $bedAssignmentRepository,
        private InpatientVitalSignRepositoryInterface $vitalSignRepository,
    )
    {
    }

    public function getInpatientAdmissions(Request $request): object
    {

        $perPage = (int)$request->input('per_page');

        return $this->admissionRepository->getInpatientAdmissions(
            filters: $request->only(['search']),
            perPage: $perPage,
        );
    }

    /** @throws Throwable */
    public function store(array $data): object
    {
        return DB::transaction(function () use ($data) {
            $admission = $this->admissionRepository->store($data);

            $this->bedAssignmentRepository->store([
                'inpatient_admission_id' => $admission->id,
                'bed_id' => $data['bed_id'],
                'assigned_at' => $data['assigned_at'],
                'released_at' => $data['released_at'] ?? null,
            ]);

            $this->bedRepository->update(['status' => 'occupied'], $data['bed_id']);

            $this->vitalSignRepository->store([
                'inpatient_admission_id' => $admission->id,
                'temperature' => $data['temperature'],
                'pulse_rate' => $data['pulse_rate'],
                'respiratory_rate' => $data['respiratory_rate'],
                'systolic' => $data['systolic'],
                'diastolic' => $data['diastolic'],
            ]);

            return $admission;
        });
    }

    public function update(array $data, InpatientAdmissionModel $admission): object
    {
        return $this->admissionRepository->update(data: $data, id: $admission->id);
    }

    public function destroy(InpatientAdmissionModel $admission): object
    {
        return $this->admissionRepository->destroy(id: $admission->id);
    }
}
