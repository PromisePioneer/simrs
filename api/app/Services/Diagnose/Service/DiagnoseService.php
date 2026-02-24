<?php

namespace App\Services\Diagnose\Service;

use App\Http\Requests\DiagnoseVisitRequest;
use App\Services\Diagnose\Trait\DiagnoseTrait;
use App\Services\OutpatientVisit\Repository\OutpatientVisitRepository;
use Illuminate\Support\Facades\DB;
use Throwable;

class DiagnoseService
{
    use DiagnoseTrait;

    protected OutpatientVisitRepository $outPatientVisitRepository;

    public function __construct()
    {
        $this->outPatientVisitRepository = new OutpatientVisitRepository();
    }

    /**
     * @throws Throwable
     */
    public function appendSoap(DiagnoseVisitRequest $request, string $visitId): object
    {
        $data = $request->validated();
        $visit = $this->outPatientVisitRepository->findById($visitId);
        DB::transaction(function () use ($visitId, $visit, $data) {

            $this->appendDiagnose(visitId: $visitId, data: $data, visit: $visit);
            $this->appendProcedure(visitId: $visitId, data: $data, visit: $visit);
            $this->appendPrescription(visitId: $visitId, data: $data, visit: $visit);


        }, 3);

        return $this->outPatientVisitRepository->findById(id: $visitId)
            ->load(['diagnoses', 'procedures', 'prescriptions']);
    }
}
