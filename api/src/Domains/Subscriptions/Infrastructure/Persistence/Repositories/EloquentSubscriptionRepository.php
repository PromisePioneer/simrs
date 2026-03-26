<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Infrastructure\Persistence\Repositories;

use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;
use Domains\Subscriptions\Domain\Repository\SubscriptionRepositoryInterface;
use Domains\Subscriptions\Infrastructure\Persistence\Models\SubscriptionModel;

class EloquentSubscriptionRepository extends BaseEloquentRepository implements SubscriptionRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new SubscriptionModel());
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()
            ->with(['plan', 'tenant'])
            ->orderBy('created_at', 'desc');

        $query = $this->applyFilters($query, $filters);

        return $perPage ? $query->paginate($perPage) : (object) $query->get();
    }

    public function findActiveByTenantId(string $tenantId): ?object
    {
        return $this->model
            ->where('tenant_id', $tenantId)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Assign subscription baru ke tenant.
     * Subscription aktif sebelumnya akan di-cancel otomatis.
     */
    public function assignSubscription(array $data): object
    {
        $existing = $this->findActiveByTenantId($data['tenant_id']);

        if ($existing) {
            $existing->update(['status' => 'cancelled']);
        }

        return $this->model->create($data);
    }

    /**
     * Expire semua subscription yang sudah melewati ends_at.
     * Dipanggil dari Job ExpireSubscriptions.
     *
     * @return int jumlah subscription yang di-expire
     */
    public function expireStale(): int
    {
        $expired = $this->model
            ->where('status', 'active')
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->get();

        foreach ($expired as $sub) {
            $sub->update([
                'status'       => 'expired',
                'cancelled_at' => now(),
            ]);
        }

        return $expired->count();
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereHas('plan', fn($q2) => $q2->where('name', 'like', '%' . $filters['search'] . '%'))
                    ->orWhereHas('tenant', fn($q2) => $q2->where('name', 'like', '%' . $filters['search'] . '%'));
            });
        }

        return $query;
    }
}
