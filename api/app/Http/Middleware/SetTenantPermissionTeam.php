<?php

namespace App\Http\Middleware;

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
            setPermissionsTeamId(Auth::user()->tenant_id);
            app()[PermissionRegistrar::class]->forgetCachedPermissions();
            auth()->user()->refresh();
        }
        return $next($request);
    }
}
