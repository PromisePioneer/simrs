<?php

namespace App\Services\Master\General\Pricing\Interface;

interface SubscriptionRepositoryInterface
{
    public function baseQuery(array $filters = []): object;

    public function getAll(array $filters = [], ?int $perPage = null);

    public function activeTenantSubs(?string $tenantId): ?object;

    public function assignSubs(array $data): object;

    public function store(array $data = []);
}
