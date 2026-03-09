<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineBatchStock;

use App\Http\Requests\MedicineBatchRequest;
use App\Services\Master\Pharmachy\Medicine\Service\MedicineBatchStockService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedicineBatchStockController
{
    protected MedicineBatchStockService $medicineBatchStockService;

    public function __construct()
    {
        $this->medicineBatchStockService = new MedicineBatchStockService();
    }


    public function getMedicineBatchStocks(Request $request)
    {
        $data = $this->medicineBatchStockService->getBatchStocks(request: $request);
        return response()->json($data);
    }


    public function store(MedicineBatchRequest $request)
    {
        $data = $this->medicineBatchStockService->store($request);
        return response()->json($data);
    }
}
