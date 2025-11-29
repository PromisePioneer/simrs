<?php

namespace App\Services\Master\General\Pricing\Service;

use App\Models\Plan;
use App\Services\Master\General\Pricing\Repository\SubscriptionRepository;
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


    public function assignSubs(
        Request $request,
        ?Plan   $plan = null,
    )
    {

        $data = [
            'plan_id' => $plan->id,
            'tenant_id' => auth()->user()->tenant_id ?? $request->input('tenant_id'),
            'status' => 'active',
            'trial_ends_at' => now()->addDays(10),
            'starts_at' => now(),
            'expires_at' => now()->addDays(10),
        ];
        return $this->subscriptionRepository->assignSubs(data: $data);
    }
}
