<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineBatch;

use App\Http\Requests\MedicineBatchRequest;
use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Services\Master\Pharmachy\Medicine\Service\MedicineBatchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineBatchController
{

    protected MedicineBatchService $medicineBatchService;

    public function __construct()
    {
        $this->medicineBatchService = new MedicineBatchService();
    }


    public function index(Request $request, Medicine $medicine): JsonResponse
    {
        $data = $this->medicineBatchService->getBatches(request: $request, medicine: $medicine);
        return response()->json($data);
    }


    public function show(MedicineBatch $medicineBatch): JsonResponse
    {
        return response()->json($medicineBatch);
    }


    public function store(MedicineBatchRequest $request)
    {
        $data = $this->medicineBatchService->store($request);
        return response()->json($data);
    }

}
