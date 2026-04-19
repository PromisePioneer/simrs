<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Domain\Repository;

interface OrderRepositoryInterface
{
    public function findValidByTenantId(string $tenantId): ?object;

    public function store(array $data): object;
}
