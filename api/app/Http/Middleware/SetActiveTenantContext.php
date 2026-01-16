<?php

namespace App\Http\Middleware;

use App\Services\Tenant\TenantContext;
use Closure;
use Illuminate\Http\Request;

class SetActiveTenantContext
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check()) {
            $user = auth()->user();

            // Set tenant context dari session
            if (session()->has('active_tenant_id')) {
                TenantContext::set(session('active_tenant_id'));
                setPermissionsTeamId(session('active_tenant_id'));
            } else {
                TenantContext::set($user->tenant_id ?? null);
                setPermissionsTeamId($user->tenant_id ?? null);
            }
        }

        return $next($request);
    }
}
