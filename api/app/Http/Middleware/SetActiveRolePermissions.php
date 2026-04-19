<?php

namespace App\Http\Middleware;

use Closure;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetActiveRolePermissions
{
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && session()->has('active_role_id')) {
            $activeRole = RoleModel::where('uuid', session('active_role_id'))->first();
            if ($activeRole) {
                // Store active role in request untuk digunakan di controller
                $request->merge(['active_role' => $activeRole]);
            }
        }

        return $next($request);
    }
}
