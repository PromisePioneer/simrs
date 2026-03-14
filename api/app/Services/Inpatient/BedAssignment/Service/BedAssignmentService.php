<?php

namespace App\Services\Inpatient\BedAssignment\Service;

use App\Models\Bed;
use App\Models\BedAssignment;
use App\Models\InpatientAdmission;
use App\Services\Inpatient\BedAssignment\Repository\BedAssignmentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class BedAssignmentService
{
    protected BedAssignmentRepository $bedAssignmentRepository;

    public function __construct()
    {
        $this->bedAssignmentRepository = new BedAssignmentRepository();
    }


    /**
     * @throws Throwable
     */
    public function transferBed(Request $request, InpatientAdmission $inpatientAdmission)
    {
        return DB::transaction(function () use ($request, $inpatientAdmission) {

            $newBed = Bed::findOrFail($request->bed_id);

            // cari bed assignment aktif
            $currentAssignment = $this->bedAssignmentRepository->findCurrentAssignment(inpatientAdmissionId: $inpatientAdmission->id);

            if ($currentAssignment) {
                $currentAssignment->update([
                    'released_at' => now()
                ]);
                $currentAssignment->bed->update([
                    'status' => 'available'
                ]);
            }

            // assign bed baru
            $newAssignment = $this->bedAssignmentRepository->store([
                'inpatient_admission_id' => $inpatientAdmission->id,
                'bed_id' => $newBed->id,
                'assigned_at' => now(),
                'released_at' => null,
            ]);
            $newBed->update([
                'status' => 'occupied'
            ]);


            return $newAssignment;
        });
    }
}
