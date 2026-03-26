<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Infrastructure\Persistence\Repositories;

use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;
use Domains\Subscriptions\Domain\Repository\SubscriptionPaymentRepositoryInterface;
use Domains\Subscriptions\Infrastructure\Persistence\Models\SubscriptionPaymentModel;

class EloquentSubscriptionPaymentRepository extends BaseEloquentRepository implements SubscriptionPaymentRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new SubscriptionPaymentModel());
    }
}
