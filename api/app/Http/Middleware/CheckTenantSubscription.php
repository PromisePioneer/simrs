<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Services\Tenant\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTenantSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return $next($request);
        }

        if (auth()->user()->hasRole('Super Admin')) {
            return $next($request);
        }

        $tenantId = session('active_tenant_id') ?? TenantContext::getId();

        $tenant = Tenant::query()->find($tenantId);

        if (!$tenant || !$tenant->hasActiveSubscription()) {
            return response()->json([
                'message' => 'Tenant Anda belum memiliki subscription aktif. Silakan pilih paket.'
            ], 403);
        }

        return $next($request);
    }

}
