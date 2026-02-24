<?php

namespace App\Services\Diagnose\Repository;

use App\Http\Requests\DiagnoseVisitRequest;
use App\Models\Diagnose;
use App\Models\OutpatientVisit;
use Illuminate\Support\Facades\DB;

class DiagnoseRepository
{

    protected Diagnose $model;
    protected OutpatientVisit $outpatientVisitModel;


    public function __construct()
    {
        $this->model = new Diagnose();
        $this->outpatientVisitModel = new OutpatientVisit();
    }

    public function appendDiagnoses(OutpatientVisit $visit, array $diagnoses): void
    {
        $visit->diagnoses()->createMany($diagnoses);
    }

    public function appendPrescriptions(OutpatientVisit $visit, array $prescriptions): void
    {
        $visit->prescriptions()->createMany($prescriptions);
    }

}
