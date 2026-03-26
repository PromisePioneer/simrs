<?php

declare(strict_types=1);

namespace Domains\Tenant\Presentation\Middleware;

use Domains\Tenant\Infrastructure\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantExists
{
    /**
     * Route yang boleh diakses tanpa tenant context.
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

        if (auth()->user()->hasRole('Super Admin')) {
            return $next($request);
        }

        foreach ($this->except as $pattern) {
            if ($request->is($pattern)) {
                return $next($request);
            }
        }

        if (!TenantContext::getId()) {
            return response()->json([
                'message' => 'Tenant context not found. Please select or switch tenant.',
            ], 403);
        }

        return $next($request);
    }
}
