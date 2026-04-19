<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\MedicineRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;

class EloquentMedicineRepository implements MedicineRepositoryInterface
{
    public function __construct(private MedicineModel $model) {}

    public function getMedicines(array $filters = [], ?int $perPage = null): ?object
    {
        $query = $this->model->with(['category', 'units'])->orderBy('name');

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('sku', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findById(string $id): ?object
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data = []): ?object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data = []): ?object
    {
        $medicine = $this->findById($id);
        $medicine->fill($data)->save();
        return $medicine->fresh();
    }

    public function destroy(string $id): ?object
    {
        $medicine = $this->findById($id);
        $medicine->delete();
        return $medicine;
    }

    public function findLastSequence(): ?object
    {
        return $this->model->orderByDesc('sequence')->lockForUpdate()->first();
    }

    public function getNextBatchFEFO(object $medicine): ?object
    {
        return $medicine->batches()
            ->whereHas('stock', fn($q) => $q->where('stock_amount', '>', 0))
            ->with(['stock' => fn($q) => $q->where('stock_amount', '>', 0)])
            ->orderBy('expired_date', 'asc')
            ->first();
    }

    public function getReadyStocksMedicine(?string $search = null): ?object
    {
        $query = $this->model
            ->with(['batches.stock'])
            ->whereHas('batches.stock', fn($q) => $q->where('stock_amount', '>', 0))
            ->with(['batches' => function ($q) {
                $q->whereHas('stock', fn($s) => $s->where('stock_amount', '>', 0))
                    ->with(['stock' => fn($s) => $s->where('stock_amount', '>', 0)->select(['id', 'batch_id', 'stock_amount'])])
                    ->orderBy('expired_date', 'asc');
            }]);

        if ($search) {
            $query->where('name', 'ilike', '%' . $search . '%');
        }

        return $query->get();
    }
}
