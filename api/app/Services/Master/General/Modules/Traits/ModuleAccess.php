<?php

namespace App\Services\Master\General\Modules\Traits;

use App\Models\Module;
use App\Services\Master\General\Modules\Repository\ModuleRepository;
use App\Services\Master\General\UserManagement\Permission\Repository\PermissionRepository;
use Illuminate\Database\Eloquent\Collection;

trait ModuleAccess
{

    protected ModuleRepository $moduleRepository;

    public static function getAccessibleMenu(): array|Collection|\Illuminate\Support\Collection
    {
        $user = auth()->user();

        if (!$user) {
            \Log::info('No authenticated user');
            return collect();
        }

        if ($user->hasRole('Super Admin')) {
            $modules = Module::whereNull('parent_id')
                ->orderBy('order')
                ->with(['permissions', 'childrenRecursive.permissions'])
                ->get();

            return $modules->map(function ($module) {
                if (isset($module->childrenRecursive)) {
                    $module->children_recursive = $module->childrenRecursive->values()->toArray();
                } else {
                    $module->children_recursive = [];
                }
                return $module;
            });
        }

        // Debug: Check tenant
        if (!$user->tenant) {
            \Log::info('User has no tenant', ['user_id' => $user->id]);
            return collect();
        }

        // Debug: Check subscription
        if (!$user->tenant->hasActiveSubscription()) {
            \Log::info('Tenant has no active subscription', ['tenant_id' => $user->tenant->id]);
            return collect();
        }

        $plan = $user->tenant->getCurrentPlan();
        \Log::info('Current plan', ['plan' => $plan->name ?? 'null']);

        $userPermissions = PermissionRepository::getPermissionsByUser($user);
        \Log::info('User permissions', ['permissions' => $userPermissions]);

        $planModuleIds = $plan->modules()
            ->where('plan_module.is_accessible', true)
            ->pluck('modules.id')
            ->toArray();

        \Log::info('Plan module IDs', ['ids' => $planModuleIds]);

        $modules = Module::whereNull('parent_id')
            ->whereIn('id', $planModuleIds)
            ->orderBy('order')
            ->with(['childrenRecursive' => function ($query) use ($planModuleIds) {
                $query->whereIn('id', $planModuleIds)->orderBy('order');
            }, 'permissions', 'childrenRecursive.permissions'])
            ->get(['id', 'name', 'route', 'parent_id', 'icon', 'order']);

        \Log::info('Modules before filter', ['count' => $modules->count(), 'modules' => $modules->toArray()]);

        $filtered = $modules->filter(function ($module) use ($userPermissions) {
            $hasAccess = static::hasAccessToModule($module, $userPermissions);
            \Log::info('Module access check', [
                'module' => $module->name,
                'has_access' => $hasAccess,
                'module_permissions' => $module->permissions->pluck('name')->toArray()
            ]);
            return $hasAccess;
        });

        \Log::info('Modules after filter', ['count' => $filtered->count()]);

        $result = $filtered->map(function ($module) use ($userPermissions) {
            $filtered = static::filterModuleChildren($module, $userPermissions);

            if (isset($filtered->childrenRecursive)) {
                $filtered->children_recursive = $filtered->childrenRecursive->values()->toArray();
                unset($filtered->childrenRecursive);
            } elseif (isset($filtered->children_recursive)) {
                if (is_object($filtered->children_recursive) && method_exists($filtered->children_recursive, 'values')) {
                    $filtered->children_recursive = $filtered->children_recursive->values()->toArray();
                } elseif (is_object($filtered->children_recursive) || (is_array($filtered->children_recursive) && !array_is_list($filtered->children_recursive))) {
                    $filtered->children_recursive = array_values((array)$filtered->children_recursive);
                }
            } else {
                $filtered->children_recursive = [];
            }

            return $filtered;
        })->values();

        \Log::info('Final result', ['count' => $result->count()]);

        return $result;
    }

    protected static function filterModuleChildren($module, array $userPermissions)
    {
        if (!isset($module->childrenRecursive) || $module->childrenRecursive->isEmpty()) {
            $module->children_recursive = [];
            return $module;
        }

        $filteredChildren = $module->childrenRecursive
            ->filter(function ($child) use ($userPermissions) {
                return static::hasAccessToModule($child, $userPermissions);
            })
            ->values()
            ->toArray();

        $module->children_recursive = $filteredChildren;
        unset($module->childrenRecursive);

        return $module;
    }

    protected static function hasAccessToModule($module, $userPermissions): bool
    {
        // FIX: Use the loaded relationship, not query
        if (!isset($module->permissions)) {
            \Log::warning('Module permissions not loaded', ['module' => $module->name]);
            return false;
        }

        // Check direct permissions on this module
        $modulePermissionNames = $module->permissions->pluck('name')->toArray();

        \Log::info('Checking module permissions', [
            'module' => $module->name,
            'module_permissions' => $modulePermissionNames,
            'user_permissions' => $userPermissions,
            'has_match' => !empty(array_intersect($modulePermissionNames, $userPermissions))
        ]);

        $hasDirectPermission = !empty(array_intersect($modulePermissionNames, $userPermissions));

        if ($hasDirectPermission) {
            return true;
        }

        // Check children permissions
        if (isset($module->childrenRecursive) && $module->childrenRecursive->isNotEmpty()) {
            foreach ($module->childrenRecursive as $child) {
                if (static::hasAccessToModule($child, $userPermissions)) {
                    return true;
                }
            }
        }

        return false;
    }

}
