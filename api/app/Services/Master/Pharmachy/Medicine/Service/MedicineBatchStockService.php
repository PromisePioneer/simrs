<?php

namespace App\Services\Master\Pharmachy\Medicine\Service;

use App\Http\Requests\MedicineBatchRequest;
use App\Models\Medicine;
use App\Services\Master\Pharmachy\Medicine\Repository\MedicineBatchStockRepository;
use Illuminate\Http\Request;

class MedicineBatchStockService
{
    protected MedicineBatchStockRepository $medicineBatchStockRepository;

    public function __construct()
    {
        $this->medicineBatchStockRepository = new MedicineBatchStockRepository();
    }

    public function getBatchStocks(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->medicineBatchStockRepository->getBatchStocks(filters: $filters, perPage: $perPage);
    }


    public function store(MedicineBatchRequest $request)
    {
        $data = $request->validated();
        return $this->medicineBatchStockRepository->store(data: $data);
    }
}
