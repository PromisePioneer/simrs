<?php

namespace App\Services\Master\Pharmachy\Medicine\Interface;

interface MedicineBatchRepositoryInterface
{
    public function getBatches(string $id, array $filters = [], ?int $perPage = null): ?object;


    public function findById(string $id): object;
}
