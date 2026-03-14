<?php

namespace App\Http\Controllers\Api\Master\General\Subscriptions;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubscriptionRequest;
use App\Models\Plan;
use App\Services\Master\General\Pricing\Service\SubscriptionService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    use ApiResponse;

    private SubscriptionService $subscriptionService;

    public function __construct()
    {
        $this->subscriptionService = new SubscriptionService();
    }

    /**
     * Assign / upgrade plan untuk tenant yang sedang login.
     * POST /api/v1/subscriptions/assign/{plan}
     */
    public function assignSubs(SubscriptionRequest $request, Plan $plan): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->assignSubs($request, $plan);
            return $this->successResponse(
                [
                    'subscription' => $subscription,
                    'plan'         => $plan->only('id', 'name', 'slug', 'price', 'billing_period'),
                ],
                "Berhasil berlangganan paket {$plan->name}."
            );
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 422);
        }
    }

    /**
     * Info subscription aktif tenant yang sedang login.
     * GET /api/v1/subscriptions/active
     */
    public function active(): JsonResponse
    {
        $tenant = auth()->user()?->getActiveTenant();

        if (!$tenant) {
            return $this->errorResponse('Tenant tidak ditemukan.', 404);
        }

        $subscription = $tenant->getActiveSubscription();

        if (!$subscription) {
            return $this->errorResponse('Tidak ada subscription aktif.', 404);
        }

        return $this->successResponse([
            'subscription' => $subscription,
            'plan'         => $subscription->plan?->only('id', 'name', 'slug', 'price', 'billing_period', 'max_users'),
            'ends_at'      => $subscription->ends_at,
        ]);
    }
}
