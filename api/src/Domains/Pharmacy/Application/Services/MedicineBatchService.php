<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\MedicineBatchRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class MedicineBatchService
{
    public function __construct(private MedicineBatchRepositoryInterface $batchRepository)
    {
    }

    public function getBatches(Request $request, MedicineModel $medicine): object
    {
        return $this->batchRepository->getBatches(
            medicineId: $medicine->id,
            filters: $request->only(['search']),
            perPage: (int)$request->input('per_page'),
        );
    }

    /** @throws Throwable */
    public function generateBatchNumber(string $medicineId): array
    {
        return DB::transaction(function () use ($medicineId) {
            $last = $this->batchRepository->findLastSequence($medicineId);
            $next = $last ? $last->sequence + 1 : 1;

            return [
                'sequence' => $next,
                'batch_number' => 'AUTO-' . date('Y') . '-' . str_pad($next, 4, '0', STR_PAD_LEFT),
                'is_auto_batch' => true,
            ];
        });
    }

    /** @throws Throwable */
    public function store(array $data): object
    {
        $auto = $this->generateBatchNumber($data['medicine_id']);
        $data['batch_number'] = $data['is_auto_batch'] ? $auto['batch_number'] : $data['batch_number'];
        $data['sequence'] = $auto['sequence'];

        return $this->batchRepository->store($data);
    }

    public function update(array $data, MedicineBatchModel $batch): object
    {
        return $this->batchRepository->update(data: $data, id: $batch->id);
    }
}
