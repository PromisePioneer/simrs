<?php

namespace App\Services\Master\Pharmachy\Medicine\Service;

use App\Http\Requests\MedicineBatchRequest;
use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Services\Master\Pharmachy\Medicine\Repository\MedicineBatchRepository;
use Illuminate\Http\Request;
use Throwable;

class MedicineBatchService
{
    protected MedicineBatchRepository $medicineBatchRepository;

    public function __construct()
    {
        $this->medicineBatchRepository = new MedicineBatchRepository();
    }

    public function getBatches(Request $request, Medicine $medicine): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');

        return $this->medicineBatchRepository->getBatches(id: $medicine->id, filters: $filters, perPage: $perPage);
    }


    /**
     * @throws Throwable
     */
    public function store(MedicineBatchRequest $request): object
    {
        $data = $request->validated();
        return $this->medicineBatchRepository->store(data: $data);
    }


    public function update(MedicineBatchRequest $request, MedicineBatch $medicineBatch): bool
    {
        $data = $request->validated();
        return $this->medicineBatchRepository->update(data: $data, id: $medicineBatch->id);
    }
}
