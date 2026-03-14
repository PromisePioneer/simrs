<?php

namespace App\Services\Master\General\Pricing\Service;

use App\Models\Plan;
use App\Services\Master\General\Pricing\Repository\SubscriptionRepository;
use App\Services\Tenant\SubscriptionCacheHelper;
use Illuminate\Http\Request;

class SubscriptionService
{
    private SubscriptionRepository $subscriptionRepository;

    public function __construct()
    {
        $this->subscriptionRepository = new SubscriptionRepository();
    }

    public function getSubscriptions(Request $request)
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');

        return $this->subscriptionRepository->getAll(
            filters: $filters,
            perPage: $perPage
        );
    }

    public function assignSubs(Request $request, ?Plan $plan = null)
    {
        $tenantId = auth()->user()->tenant_id ?? $request->input('tenant_id');

        $data = [
            'plan_id'       => $plan->id,
            'tenant_id'     => $tenantId,
            'status'        => 'active',
            'trial_ends_at' => null,
            'starts_at'     => now(),
            'ends_at'       => now()->addMonth(), // ✅ bukan expires_at
        ];

        $subscription = $this->subscriptionRepository->assignSubs(data: $data);

        // ✅ Clear cache akses module supaya plan baru langsung berlaku
        SubscriptionCacheHelper::clearModuleAccess($tenantId);

        return $subscription;
    }
}
