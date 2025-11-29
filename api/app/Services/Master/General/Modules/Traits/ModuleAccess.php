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
            return Module::whereNull('parent_id')
                ->orderBy('order')
                ->with(['permissions', 'childrenRecursive.permissions'])
                ->get();
        }

        if (!$user->tenant || !$user->tenant->hasActiveSubscription()) {
            return collect();
        }

        $plan = $user->tenant->getCurrentPlan();
        $userPermissions = PermissionRepository::getPermissionsByUser($user);

        // Get modules yang allowed di tenant's plan
        $planModuleIds = $plan->modules()
            ->where('plan_module.is_accessible', true)
            ->pluck('modules.id')
            ->toArray();

        return Module::whereNull('parent_id')
            ->whereIn('id', $planModuleIds)
            ->orderBy('order')
            ->with(['childrenRecursive' => function ($query) use ($planModuleIds) {
                $query->whereIn('id', $planModuleIds)->orderBy('order');
            }])
            ->get(['id', 'name', 'route', 'parent_id', 'icon', 'order'])
            ->filter(function ($module) use ($userPermissions) {
                return static::hasAccessToModule($module, $userPermissions);
            })
            ->map(function ($module) use ($userPermissions) {
                return static::filterModuleChildren($module, $userPermissions);
            });
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


    protected static function filterModuleChildren($module, $userPermissions)
    {
        if ($module->childrenRecursive->isNotEmpty()) {
            $module->setRelation(
                'childrenRecursive',
                $module->childrenRecursive
                    ->filter(function ($child) use ($userPermissions) {
                        return static::hasAccessToModule($child, $userPermissions);
                    })
                    ->map(function ($child) use ($userPermissions) {
                        return static::filterModuleChildren($child, $userPermissions);
                    })
            );
        }

        if ($module->permissions) {
            $module->setRelation(
                'permissions',
                $module->permissions->whereIn('name', $userPermissions)->select('uuid', 'name')
            );
        }

        return $module;
    }

}
