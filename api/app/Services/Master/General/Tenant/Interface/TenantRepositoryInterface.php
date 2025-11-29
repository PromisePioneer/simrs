<?php

namespace App\Services\Master\General\Tenant\Interface;

interface TenantRepositoryInterface
{
    public function getTenants(array $filters, ?int $perPage = null): object;

    public function findById(string $id): object;
}
