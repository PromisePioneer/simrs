<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Repositories;

use Domains\Pharmacy\Domain\Repository\MedicineBatchStockRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchStockModel;

class EloquentMedicineBatchStockRepository implements MedicineBatchStockRepositoryInterface
{
    public function __construct(private MedicineBatchStockModel $model) {}

    public function getBatchStocks(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model
            ->with(['batch', 'batch.medicine', 'warehouse', 'rack']);

        if (!empty($filters['batch_id'])) {
            $query->where('batch_id', $filters['batch_id']);
        }

        if (!empty($filters['warehouse_id'])) {
            $query->where('warehouse_id', $filters['warehouse_id']);
        }

        return $perPage ? $query->paginate($perPage) : $query->get();
    }

    public function findById(string $id): object
    {
        return $this->model->with(['batch', 'warehouse', 'rack'])->findOrFail($id);
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }
}
