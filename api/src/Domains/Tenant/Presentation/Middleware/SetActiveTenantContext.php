<?php

declare(strict_types=1);

namespace Domains\Tenant\Presentation\Middleware;

use Domains\Tenant\Infrastructure\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;

class SetActiveTenantContext
{
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check()) {
            $user = auth()->user();

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
