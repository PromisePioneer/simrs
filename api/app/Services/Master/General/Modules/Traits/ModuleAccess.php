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
            return collect();
        }

        if ($user->hasRole('Super Admin')) {
            $modules = Module::whereNull('parent_id')
                ->orderBy('order')
                ->with(['permissions', 'childrenRecursive.permissions'])
                ->get();

            // Convert to array format
            return $modules->map(function ($module) {
                if (isset($module->childrenRecursive)) {
                    $module->children_recursive = $module->childrenRecursive->values()->toArray();
                } else {
                    $module->children_recursive = [];
                }
                return $module;
            });
        }

        if (!$user->tenant || !$user->tenant->hasActiveSubscription()) {
            return collect();
        }

        $plan = $user->tenant->getCurrentPlan();
        $userPermissions = PermissionRepository::getPermissionsByUser($user);

        $planModuleIds = $plan->modules()
            ->where('plan_module.is_accessible', true)
            ->pluck('modules.id')
            ->toArray();

        return Module::whereNull('parent_id')
            ->whereIn('id', $planModuleIds)
            ->orderBy('order')
            ->with(['childrenRecursive' => function ($query) use ($planModuleIds) {
                $query->whereIn('id', $planModuleIds)->orderBy('order');
            }, 'permissions', 'childrenRecursive.permissions'])
            ->get(['id', 'name', 'route', 'parent_id', 'icon', 'order'])
            ->filter(function ($module) use ($userPermissions) {
                return static::hasAccessToModule($module, $userPermissions);
            })
            ->map(function ($module) use ($userPermissions) {
                $filtered = static::filterModuleChildren($module, $userPermissions);

                // Ensure children_recursive is always an array
                if (isset($filtered->childrenRecursive)) {
                    $filtered->children_recursive = $filtered->childrenRecursive->values()->toArray();
                    unset($filtered->childrenRecursive);
                } elseif (isset($filtered->children_recursive)) {
                    // If it's already children_recursive but as collection/object
                    if (is_object($filtered->children_recursive) && method_exists($filtered->children_recursive, 'values')) {
                        $filtered->children_recursive = $filtered->children_recursive->values()->toArray();
                    } elseif (is_object($filtered->children_recursive) || (is_array($filtered->children_recursive) && !array_is_list($filtered->children_recursive))) {
                        $filtered->children_recursive = array_values((array)$filtered->children_recursive);
                    }
                } else {
                    $filtered->children_recursive = [];
                }

                return $filtered;
            })
            ->values();
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
            ->values() // This ensures sequential array [0, 1, 2...]
            ->toArray();

        $module->children_recursive = $filteredChildren;
        unset($module->childrenRecursive);

        return $module;
    }

    protected static function hasAccessToModule($module, $userPermissions): bool
    {
        $hasDirectPermission = $module->permissions()
            ->whereIn('name', $userPermissions)
            ->exists();

        if ($hasDirectPermission) {
            return true;
        }

        foreach ($module->childrenRecursive as $child) {
            if (static::hasAccessToModule($child, $userPermissions)) {
                return true;
            }
        }

        return false;
    }

}
