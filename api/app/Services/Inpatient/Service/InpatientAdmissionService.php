<?php

namespace App\Services\Inpatient\Service;

use App\Http\Requests\InpatientAdmissionRequest;
use App\Models\InpatientAdmission;
use App\Services\Inpatient\Repository\InpatientAdmissionRepository;
use Illuminate\Http\Request;

class InpatientAdmissionService
{

    protected InpatientAdmissionRepository $inpatientAdmissionRepository;

    public function __construct()
    {
        $this->inpatientAdmissionRepository = new InpatientAdmissionRepository();
    }


    public function getInpatientAdmissions(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');

        return $this->inpatientAdmissionRepository->getInpatientAdmissions(filters: $filters, perPage: $perPage);
    }


    public function store(InpatientAdmissionRequest $request): object
    {
        $data = $request->validated();
        return $this->inpatientAdmissionRepository->store(data: $data);
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
