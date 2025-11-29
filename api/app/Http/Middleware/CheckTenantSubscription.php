<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTenantSubscription
{
    public function handle(Request $request, Closure $next): Response
    {
        setPermissionsTeamId(null);
        $user = auth()->user();

        if (auth()->check()) {
            if ($user->hasRole('Super Admin')) {
                return $next($request);
            }

            if (!$user->hasActiveSubscription()) {
                return response()->json('Tenant Anda belum memiliki subscription aktif. Silakan pilih paket.', 403);
            }

        }

        return $next($request);
    }

}
