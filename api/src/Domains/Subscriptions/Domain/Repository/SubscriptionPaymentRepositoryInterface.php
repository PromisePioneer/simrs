<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Domain\Repository;

interface SubscriptionPaymentRepositoryInterface
{
    public function store(array $data): object;
}
