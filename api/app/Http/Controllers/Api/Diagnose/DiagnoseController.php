<?php

namespace App\Http\Controllers\Api\Diagnose;

use App\Http\Controllers\Controller;
use App\Http\Requests\DiagnoseVisitRequest;
use App\Models\Diagnose;
use App\Models\OutpatientVisit;
use App\Services\Diagnose\Service\DiagnoseService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Throwable;

class DiagnoseController extends Controller
{


    use ApiResponse;

    protected DiagnoseService $diagnoseService;

    public function __construct()
    {
        $this->diagnoseService = new DiagnoseService();
    }


    /**
     * @throws Throwable
     */
    public function store(DiagnoseVisitRequest $request, OutpatientVisit $outpatientVisit)
    {
        $data = $this->diagnoseService->appendSoap($request, $outpatientVisit->id);
        return $this->successResponse(data: $data, message: 'Data berhasil disimpan');
    }
}
