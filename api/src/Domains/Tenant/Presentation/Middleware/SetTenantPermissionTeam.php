<?php

declare(strict_types=1);

namespace Domains\Tenant\Presentation\Middleware;

use Domains\Tenant\Infrastructure\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\PermissionRegistrar;
use Symfony\Component\HttpFoundation\Response;

class SetTenantPermissionTeam
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user     = Auth::user();
            $tenantId = session('active_tenant_id') ?? $user->tenant_id ?? TenantContext::getId();

            TenantContext::set($tenantId);
            setPermissionsTeamId($tenantId);
            app(PermissionRegistrar::class)->forgetCachedPermissions();
        }

        return $next($request);
    }
}
