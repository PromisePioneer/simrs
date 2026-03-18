<?php

declare(strict_types=1);

namespace Domains\Inpatient\Application\Services;

use Domains\Facility\Infrastructure\Persistence\Models\BedModel;
use Domains\Inpatient\Domain\Repository\BedAssignmentRepositoryInterface;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class BedAssignmentService
{
    public function __construct(private BedAssignmentRepositoryInterface $bedAssignmentRepository) {}

    /** @throws Throwable */
    public function transferBed(Request $request, InpatientAdmissionModel $admission): object
    {
        return DB::transaction(function () use ($request, $admission) {
            $newBed = BedModel::findOrFail($request->bed_id);

            $current = $this->bedAssignmentRepository->findCurrentAssignment(
                inpatientAdmissionId: $admission->id
            );

            if ($current) {
                $current->update(['released_at' => now()]);
                $current->bed->update(['status' => 'available']);
            }

            $newAssignment = $this->bedAssignmentRepository->store([
                'inpatient_admission_id' => $admission->id,
                'bed_id'                 => $newBed->id,
                'assigned_at'            => now(),
                'released_at'            => null,
            ]);

            $newBed->update(['status' => 'occupied']);

            return $newAssignment;
        });
    }
}
