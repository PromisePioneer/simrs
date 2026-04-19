<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\MedicineBatchRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchStockModel;
use Illuminate\Support\Facades\DB;
use Throwable;

readonly class EloquentMedicineBatchRepository implements MedicineBatchRepositoryInterface
{
    public function __construct(
        private MedicineBatchModel      $model,
        private MedicineBatchStockModel $stockModel,
    )
    {
    }

    public function getBatches(string $medicineId, array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model
            ->with(['stock', 'stock.warehouse', 'stock.rack'])
            ->where('medicine_id', $medicineId);

        if (!empty($filters['search'])) {
            $query->where('batch_number', 'like', '%' . $filters['search'] . '%');
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->with(['stock', 'stock.warehouse', 'stock.rack'])->findOrFail($id);
    }

    /** @throws Throwable */
    public function store(array $data): object
    {
        return DB::transaction(function () use ($data) {
            $last = $this->model
                ->where('medicine_id', $data['medicine_id'])
                ->orderByDesc('sequence')
                ->lockForUpdate()
                ->first();

            $data['sequence'] = $last ? $last->sequence + 1 : 1;

            $batch = $this->model->create($data);

            $this->stockModel->create([
                'batch_id' => $batch->id,
                'warehouse_id' => $data['warehouse_id'],
                'rack_id' => $data['rack_id'] ?? null,
                'stock_amount' => $data['stock_amount'],
                'tenant_id' => $batch->tenant_id,
            ]);

            return $batch->fresh(['stock', 'stock.warehouse', 'stock.rack']);
        });
    }

    /** @throws Throwable */
    public function update(array $data, string $id): object
    {
        return DB::transaction(function () use ($data, $id) {
            $batch = $this->model->findOrFail($id);

            $batch->update([
                'expired_date' => $data['expired_date'],
                'selling_price' => $data['selling_price'] ?? $batch->selling_price,
            ]);

            $this->stockModel->where('batch_id', $id)->update([
                'warehouse_id' => $data['warehouse_id'],
                'rack_id' => $data['rack_id'] ?? null,
                'stock_amount' => $data['stock_amount'],
            ]);

            return $batch->fresh(['stock', 'stock.warehouse', 'stock.rack']);
        });
    }

    /**
     * @throws Throwable
     */
    public function findLastSequence(string $medicineId): ?object
    {
        return DB::transaction(function () use ($medicineId) {
            return $this->model
                ->where('medicine_id', $medicineId)
                ->orderByDesc('sequence')
                ->lockForUpdate()
                ->first();
        });
    }
}
