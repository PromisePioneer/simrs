<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Domain\Repository;

interface SubscriptionRepositoryInterface
{
    public function findAll(array $filters = [], ?int $perPage = null): object;

    public function findActiveByTenantId(string $tenantId): ?object;

    public function assignSubscription(array $data): object;

    public function expireStale(): int;
}
