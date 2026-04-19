<?php

declare(strict_types=1);

namespace Domains\Tenant\Presentation\Middleware;

use Domains\IAM\Infrastructure\Persistence\Models\ModuleModel;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Domains\Tenant\Infrastructure\Services\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CheckModuleAccess
{
    /**
     * Cek dua lapis:
     * 1. Plan tenant punya akses ke module ini? (plan_module.is_accessible)
     * 2. User punya permission di module ini? (spatie permission)
     *
     * Penggunaan: middleware('module:Rawat Inap')
     */
    public function handle(Request $request, Closure $next, string $moduleName): Response
    {
        $user = auth()->user();

        // Super Admin bypass semua
        if ($user?->hasRole('Super Admin')) {
            return $next($request);
        }

        $tenantId = session('active_tenant_id') ?? TenantContext::getId();

        if (!$tenantId) {
            return response()->json(['message' => 'Tenant context tidak ditemukan.'], 403);
        }

        // Cache module lookup — module jarang berubah
        $module = Cache::remember(
            "module:name:{$moduleName}",
            now()->addHour(),
            fn() => ModuleModel::where('name', $moduleName)
                ->with('permissions')
                ->first()
        );

        if (!$module) {
            return response()->json(['message' => "Module '{$moduleName}' tidak ditemukan."], 404);
        }

        // ── Lapis 1: cek plan tenant ──────────────────────────────────────
        $planCacheKey = "tenant:{$tenantId}:module:{$module->id}:plan_access";

        $planAllows = Cache::remember($planCacheKey, now()->addMinutes(5), function () use ($tenantId, $module) {
            $tenant = TenantModel::find($tenantId);
            return $tenant?->canAccessModule($module->id) ?? false;
        });

        if (!$planAllows) {
            return response()->json([
                'message' => "Paket Anda tidak memiliki akses ke modul '{$moduleName}'.",
                'module'  => $moduleName,
                'upgrade' => true,
            ], 403);
        }

        // ── Lapis 2: cek permission user ──────────────────────────────────
        $modulePermissionNames = $module->permissions->pluck('name')->toArray();

        if (empty($modulePermissionNames)) {
            return $next($request);
        }

        $userPermissions = $user->getActivePermissionNames();
        $hasPermission   = !empty(array_intersect($modulePermissionNames, $userPermissions));

        if (!$hasPermission) {
            return response()->json([
                'message' => "Anda tidak memiliki izin untuk mengakses modul '{$moduleName}'.",
                'module'  => $moduleName,
            ], 403);
        }

        return $next($request);
    }
}
