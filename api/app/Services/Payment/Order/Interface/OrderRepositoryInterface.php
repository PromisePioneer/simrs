<?php

namespace App\Services\Payment\Order\Interface;

interface OrderRepositoryInterface
{
    public function getValidByTenantId(string $tenantId): ?object;

    public function store(array $data): ?object;
}
