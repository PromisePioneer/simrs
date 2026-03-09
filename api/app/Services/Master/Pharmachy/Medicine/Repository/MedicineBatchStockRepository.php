<?php

namespace App\Services\Master\Pharmachy\Medicine\Repository;

use App\Models\MedicineBatchStock;

class MedicineBatchStockRepository
{

    protected MedicineBatchStock $model;

    public function __construct()
    {
        $this->model = new MedicineBatchStock();
    }

    public function getBatchStocks(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->with('batch.warehouse', 'batch.rack');

        if (!empty($filters['search'])) {
            $query->whereHas('batch', function ($query) use ($filters) {
                $query->where('batch_number', 'like', '%' . $filters['search'] . '%');
            });
        }


        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }


    public function store(array $data)
    {
        return $this->model->query()->create($data);
    }

}
