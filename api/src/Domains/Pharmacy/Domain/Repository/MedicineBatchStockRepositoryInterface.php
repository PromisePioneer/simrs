<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Domain\Repository;

interface MedicineBatchStockRepositoryInterface
{
    public function getBatchStocks(array $filters = [], ?int $perPage = null): object;
    public function findById(string $id): object;
    public function store(array $data): object;
}
