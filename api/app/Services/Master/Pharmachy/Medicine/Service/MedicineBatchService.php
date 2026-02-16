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


    public function generateBatchNumber(string $medicineId): array
    {
        return \DB::transaction(function () use ($medicineId) {
            $last = $this->medicineBatchRepository->findLastSequence($medicineId);
            $next = $last ? $last->sequence + 1 : 1;


            return [
                'sequence' => $next,
                'batch_number' => 'AUTO-' . date('Y') . '-' . str_pad($next, 4, '0', STR_PAD_LEFT),
                'is_auto_batch' => true,
            ];
        });
    }

    /**
     * @throws Throwable
     */
    public function store(MedicineBatchRequest $request): object
    {
        $data = $request->validated();
        $autoBatch = $this->generateBatchNumber($data['medicine_id']);
        $data['batch_number'] = $data['is_auto_batch'] ? $autoBatch['batch_number'] : $data['batch_number'];
        $data['sequence'] = $autoBatch['sequence'];
        return $this->medicineBatchRepository->store(data: $data);
    }


    public function update(MedicineBatchRequest $request, MedicineBatch $medicineBatch): object
    {
        $data = $request->validated();
        return $this->medicineBatchRepository->update(data: $data, id: $medicineBatch->id);
    }
}
