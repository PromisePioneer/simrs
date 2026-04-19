<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Application\Services;

use Domains\Subscriptions\Domain\Repository\PlanRepositoryInterface;
use Domains\Subscriptions\Domain\Repository\SubscriptionRepositoryInterface;
use Domains\Tenant\Infrastructure\Services\SubscriptionCacheHelper;
use Illuminate\Support\Facades\Log;

class SubscriptionService
{
    public function __construct(
        private readonly SubscriptionRepositoryInterface $subscriptionRepository,
        private readonly PlanRepositoryInterface $planRepository,
    ) {}

    public function getAll(array $filters = [], ?int $perPage = null): object
    {
        return $this->subscriptionRepository->findAll($filters, $perPage);
    }

    public function getActiveByTenantId(string $tenantId): ?object
    {
        return $this->subscriptionRepository->findActiveByTenantId($tenantId);
    }

    /**
     * Assign plan ke tenant (manual, tanpa pembayaran).
     * Dipakai untuk: free plan, trial, atau assign manual oleh admin.
     */
    public function assignPlanToTenant(string $tenantId, string $planId): object
    {
        $plan = $this->planRepository->findById($planId);

        $subscription = $this->subscriptionRepository->assignSubscription([
            'tenant_id'     => $tenantId,
            'plan_id'       => $plan->id,
            'status'        => 'active',
            'starts_at'     => now(),
            'ends_at'       => now()->addMonth(),
            'trial_ends_at' => null,
            'cancelled_at'  => null,
        ]);

        SubscriptionCacheHelper::clearModuleAccess($tenantId);

        return $subscription;
    }

    /**
     * Expire semua subscription yang sudah melewati ends_at.
     * Dipanggil dari Job ExpireSubscriptions.
     */
    public function expireStale(): void
    {
        $count = $this->subscriptionRepository->expireStale();

        Log::info('[SubscriptionService] Subscription stale di-expire.', [
            'total_expired' => $count,
        ]);
    }
}
