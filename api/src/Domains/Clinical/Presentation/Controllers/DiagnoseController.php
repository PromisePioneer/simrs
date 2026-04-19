<?php

declare(strict_types=1);

namespace Domains\Clinical\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Clinical\Application\Services\DiagnoseService;
use Domains\Clinical\Presentation\Requests\DiagnoseVisitRequest;
use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Illuminate\Http\JsonResponse;

class DiagnoseController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DiagnoseService $service) {}

    /**
     * POST /diagnoses/{outpatientVisitId}
     * Simpan SOAP data (diagnosa + prosedur + resep) sekaligus.
     */
    public function store(DiagnoseVisitRequest $request, string $outpatientVisitId): JsonResponse
    {
        $result = $this->service->appendSoap($request->validated(), $outpatientVisitId);
        return $this->successResponse($result, 'Data berhasil disimpan.');
    }
}
