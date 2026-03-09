<?php

namespace App\Http\Middleware;

use App\Services\Tenant\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantExists
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return $next($request);
        }

        if (auth()->user()->hasRole('Super Admin')) {
            return $next($request);
        }

        if (!TenantContext::getId()) {
            return response()->json([
                'message' => 'Tenant context not found. Please select or switch tenant.'
            ], 403);
        }

        return $next($request);
    }
}
