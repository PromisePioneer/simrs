<?php

namespace App\Http\Middleware;

use App\Services\Tenant\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\PermissionRegistrar;
use Symfony\Component\HttpFoundation\Response;

class SetTenantPermissionTeam
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $tenantId = session('active_tenant_id', $user->tenant_id ?? TenantContext::getId());
            TenantContext::set($tenantId);
            setPermissionsTeamId($tenantId);
            app(PermissionRegistrar::class)->forgetCachedPermissions();
        }
        return $next($request);
    }
}
