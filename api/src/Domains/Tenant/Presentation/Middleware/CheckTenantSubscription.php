<?php

declare(strict_types=1);

namespace Domains\Tenant\Presentation\Middleware;

use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Domains\Tenant\Infrastructure\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTenantSubscription
{
    /**
     * Route yang boleh diakses meski belum punya subscription aktif.
     */
    private array $except = [
        'api/v1/subscriptions/assign/*',
        'api/v1/subscriptions/plans',
        'api/v1/subscriptions/plans/*',
        'api/v1/subscriptions/active',
        'api/v1/me',
        'api/v1/orders/generate',
        'api/v1/orders/active',
        'api/v1/orders/webhook/*',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return $next($request);
        }

        // Super Admin bypass
        if (auth()->user()->hasRole('Super Admin')) {
            return $next($request);
        }

        foreach ($this->except as $pattern) {
            if ($request->is($pattern)) {
                return $next($request);
            }
        }

        $tenantId = session('active_tenant_id') ?? TenantContext::getId();
        $tenant   = TenantModel::find($tenantId);

        if (!$tenant || !$tenant->hasActiveSubscription()) {
            return response()->json([
                'message' => 'Tenant Anda belum memiliki subscription aktif. Silakan pilih paket.',
                'upgrade' => true,
            ], 403);
        }

        return $next($request);
    }
}
