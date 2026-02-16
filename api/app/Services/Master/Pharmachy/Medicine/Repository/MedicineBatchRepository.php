<?php

namespace App\Services\Master\Pharmachy\Medicine\Repository;

use App\Http\Requests\MedicineBatchRequest;
use App\Models\MedicineBatch;
use App\Models\MedicineBatchStock;
use App\Services\Master\Pharmachy\Medicine\Interface\MedicineBatchRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Throwable;

class MedicineBatchRepository implements MedicineBatchRepositoryInterface
{
    protected MedicineBatch $medicineBatchModel;
    protected MedicineBatchStock $medicineBatchStockModel;

    public function __construct()
    {
        $this->medicineBatchModel = new MedicineBatch();
        $this->medicineBatchStockModel = new MedicineBatchStock();
    }

    public function getBatches(string $id, array $filters = [], ?int $perPage = null): ?object
    {

        $query = $this->medicineBatchModel->with(['stock', 'stock.warehouse', 'stock.rack'])->where('medicine_id', $id);

        if (!empty($filters['search'])) {
            $query->where('batch_number', 'like', '%' . $filters['search'] . '%');
        }

        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }


    public function findById(string $id): object
    {
        return $this->medicineBatchModel->findOrFail($id);
    }


    /**
     * @throws Throwable
     */
    public function store(array $data = []): object
    {

        return DB::transaction(function () use ($data) {
            $medicineBatch = $this->medicineBatchModel->create($data);
            $this->medicineBatchStockModel->create([
                'batch_id' => $medicineBatch->id,
                'warehouse_id' => $data['warehouse_id'],
                'rack_id' => $data['rack_id'],
                'stock_amount' => $data['stock_amount']
            ]);

            return $medicineBatch;
        });
    }

    public function update(array $data, string $id): object
    {
        return DB::transaction(function () use ($data, $id) {

            // Update batch
            $medicineBatch = $this->medicineBatchModel->findOrFail($id);

            $medicineBatch->update([
                'expired_date' => $data['expired_date'],
            ]);

            // Update stock
            $this->medicineBatchStockModel
                ->where('batch_id', $id)
                ->update([
                    'warehouse_id' => $data['warehouse_id'],
                    'rack_id' => $data['rack_id'],
                    'stock_amount' => $data['stock_amount'],
                ]);

            return $medicineBatch->fresh();
        });
    }


    public function findLastSequence(string $medicineId): ?object
    {
        return $this->medicineBatchModel
            ->where('medicine_id', $medicineId)
            ->orderByDesc('sequence')
            ->lockForUpdate()
            ->first();
    }
}
