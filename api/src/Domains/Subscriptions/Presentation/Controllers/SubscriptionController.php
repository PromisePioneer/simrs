<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Presentation\Controllers;

use App\Traits\ApiResponse;
use Domains\Subscriptions\Application\Services\SubscriptionService;
use Domains\Subscriptions\Presentation\Requests\SubscriptionRequest;
use Domains\Subscriptions\Presentation\Resources\PlanResource;
use Domains\Subscriptions\Presentation\Resources\SubscriptionResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class SubscriptionController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly SubscriptionService $subscriptionService,
    ) {}

    /**
     * Assign / upgrade plan untuk tenant yang sedang login.
     * POST /api/v1/subscriptions/assign/{planId}
     */
    public function assignSubs(SubscriptionRequest $request, string $planId): JsonResponse
    {
        try {
            $tenantId     = auth()->user()?->getActiveTenantId();
            $subscription = $this->subscriptionService->assignPlanToTenant($tenantId, $planId);

            return $this->successResponse(
                new SubscriptionResource($subscription->load('plan')),
                "Berhasil berlangganan paket."
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
        $tenantId = auth()->user()?->getActiveTenantId();

        if (!$tenantId) {
            return $this->errorResponse('Tenant tidak ditemukan.', 404);
        }

        $subscription = $this->subscriptionService->getActiveByTenantId($tenantId);

        if (!$subscription) {
            return $this->errorResponse('Tidak ada subscription aktif.', 404);
        }

        return $this->successResponse([
            'subscription' => new SubscriptionResource($subscription),
            'plan'         => new PlanResource($subscription->plan),
            'ends_at'      => $subscription->ends_at?->toDateTimeString(),
        ]);
    }
}
