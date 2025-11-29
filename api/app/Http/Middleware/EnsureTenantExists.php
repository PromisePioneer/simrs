<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantExists
{
    /**
     * Handle an incoming request.
     *
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Kalau belum login, lanjut aja
        if (!$user) {
            return $next($request);
        }

        $tenant = $user->tenant_id ?? null;

        if (!$tenant) {
            return response()->json([
                'message' => 'Tenant not found for this user, consider switch tenant if you dont has a tenant for testing purposes',
            ], 403);
        }

        return $next($request);
    }
}
