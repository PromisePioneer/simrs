<?php

namespace App\Services\Inpatient\Admission\Service;

use App\Http\Requests\InpatientAdmissionRequest;
use App\Models\InpatientAdmission;
use App\Services\Facilities\Bed\Repository\BedRepository;
use App\Services\Inpatient\Admission\Repository\InpatientAdmissionRepository;
use App\Services\Inpatient\BedAssignment\Repository\BedAssignmentRepository;
use App\Services\Inpatient\VitalSign\Repository\InpatientVitalSignRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class InpatientAdmissionService
{

    protected
    InpatientAdmissionRepository $inpatientAdmissionRepository;
    protected BedRepository $bedRepository;

    protected BedAssignmentRepository $bedAssignmentRepository;

    protected InpatientVitalSignRepository $inpatientVitalSignRepository;

    public function __construct()
    {
        $this->inpatientAdmissionRepository = new InpatientAdmissionRepository();
        $this->bedRepository = new BedRepository();
        $this->bedAssignmentRepository = new BedAssignmentRepository();
        $this->inpatientVitalSignRepository = new InpatientVitalSignRepository();
    }


    public function getInpatientAdmissions(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');

        return $this->inpatientAdmissionRepository->getInpatientAdmissions(filters: $filters, perPage: $perPage);
    }


    /**
     * @throws Throwable
     */
    public function store(InpatientAdmissionRequest $request): object
    {

        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $inpatient = $this->inpatientAdmissionRepository->store(data: $data);
            $this->bedAssignmentRepository->store([
                'inpatient_admission_id' => $inpatient->id,
                'bed_id' => $data['bed_id'],
                'assigned_at' => $data['assigned_at'],
                'released_at' => $data['released_at'],
            ]);


            $this->bedRepository->update([
                'status' => 'occupied'
            ], $data['bed_id']);


            $this->inpatientVitalSignRepository->store([
                'inpatient_admission_id' => $inpatient->id,
                'temperature' => $data['temperature'],
                'pulse_rate' => $data['pulse_rate'],
                'respiratory_rate' => $data['respiratory_rate'],
                'systolic' => $data['systolic'],
                'diastolic' => $data['diastolic'],
            ]);

            return $inpatient;
        });

    }


    public function update(InpatientAdmissionRequest $request, InpatientAdmission $inpatientAdmission): object
    {
        $data = $request->validated();
        return $this->inpatientAdmissionRepository->update(data: $data, id: $inpatientAdmission->id);
    }


    public function destroy(InpatientAdmission $inpatientAdmission): object
    {
        return $this->inpatientAdmissionRepository->destroy(id: $inpatientAdmission->id);
    }
}
