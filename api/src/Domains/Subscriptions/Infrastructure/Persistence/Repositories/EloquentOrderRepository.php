<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Infrastructure\Persistence\Repositories;

use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;
use Domains\Subscriptions\Domain\Repository\OrderRepositoryInterface;
use Domains\Subscriptions\Infrastructure\Persistence\Models\OrderModel;

class EloquentOrderRepository extends BaseEloquentRepository implements OrderRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new OrderModel());
    }

    /**
     * Ambil order pending yang belum expired milik tenant.
     */
    public function findValidByTenantId(string $tenantId): ?object
    {
        return $this->model
            ->where('tenant_id', $tenantId)
            ->where('status', 'pending')
            ->where('expires_at', '>', now())
            ->with(['plan', 'payment'])
            ->latest()
            ->first();
    }
}
