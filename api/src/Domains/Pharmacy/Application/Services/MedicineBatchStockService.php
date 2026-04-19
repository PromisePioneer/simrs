<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\MedicineBatchStockRepositoryInterface;
use Illuminate\Http\Request;

class MedicineBatchStockService
{
    public function __construct(
        private MedicineBatchStockRepositoryInterface $batchStockRepository
    ) {}

    public function getBatchStocks(Request $request): object
    {
        return $this->batchStockRepository->getBatchStocks(
            filters: $request->only(['batch_id', 'warehouse_id']),
            perPage: $request->input('per_page'),
        );
    }

    public function store(array $data): object
    {
        return $this->batchStockRepository->store($data);
    }
}
