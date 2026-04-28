<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Traits;

use Domains\IAM\Infrastructure\Persistence\Models\ModuleModel;
use Domains\IAM\Infrastructure\Persistence\Repositories\EloquentPermissionRepository;
use Illuminate\Database\Eloquent\Collection;

trait ModuleAccess
{
    public static function getAccessibleMenu(): array|Collection|\Illuminate\Support\Collection
    {
        $user = auth()->user();

        if (!$user) {
            \Log::info('No authenticated user');
            return collect();
        }

        if ($user->hasRole('Super Admin')) {
            $modules = ModuleModel::whereNull('parent_id')
                ->orderBy('order')
                ->with(['permissions', 'childrenRecursive.permissions'])
                ->get();

            return $modules->map(function ($module) {
                $module->children_recursive = isset($module->childrenRecursive)
                    ? $module->childrenRecursive->values()->toArray()
                    : [];
                return $module;
            });
        }

        $plan = $user->getCurrentTenantPlan();
        $userPermissions = (new EloquentPermissionRepository())->getPermissionsByUser($user);
//        dd($plan);
        $planModuleIds = $plan->modules()
            ->where('plan_module.is_accessible', true)
            ->pluck('modules.id')
            ->toArray();

        \Log::info('Plan module IDs', ['ids' => $planModuleIds]);

        $modules = ModuleModel::whereNull('parent_id')
            ->whereIn('id', $planModuleIds)
            ->orderBy('order')
            ->with([
                'childrenRecursive' => fn($q) => $q->whereIn('id', $planModuleIds)->orderBy('order'),
                'permissions',
                'childrenRecursive.permissions',
            ])
            ->get(['id', 'name', 'route', 'parent_id', 'icon', 'order']);

        \Log::info('Modules before filter', ['count' => $modules->count()]);

        $filtered = $modules->filter(
            fn($module) => static::hasAccessToModule($module, $userPermissions)
        );

        return $filtered->map(function ($module) use ($userPermissions) {
            $filtered = static::filterModuleChildren($module, $userPermissions);

            if (isset($filtered->childrenRecursive)) {
                $filtered->children_recursive = $filtered->childrenRecursive->values()->toArray();
                unset($filtered->childrenRecursive);
            } elseif (isset($filtered->children_recursive)) {
                $cr = $filtered->children_recursive;
                if (is_object($cr) && method_exists($cr, 'values')) {
                    $filtered->children_recursive = $cr->values()->toArray();
                } elseif (is_object($cr) || (is_array($cr) && !array_is_list($cr))) {
                    $filtered->children_recursive = array_values((array)$cr);
                }
            } else {
                $filtered->children_recursive = [];
            }

            return $filtered;
        })->values();
    }

    protected static function filterModuleChildren(object $module, array $userPermissions): object
    {
        if (!isset($module->childrenRecursive) || $module->childrenRecursive->isEmpty()) {
            $module->children_recursive = [];
            return $module;
        }

        $module->children_recursive = $module->childrenRecursive
            ->filter(fn($child) => static::hasAccessToModule($child, $userPermissions))
            ->values()
            ->toArray();

        unset($module->childrenRecursive);

        return $module;
    }

    protected static function hasAccessToModule(object $module, array $userPermissions): bool
    {
        if (!isset($module->permissions)) {
            \Log::warning('Module permissions not loaded', ['module' => $module->name]);
            return false;
        }

        $modulePermissionNames = $module->permissions->pluck('name')->toArray();
        $hasDirectPermission = !empty(array_intersect($modulePermissionNames, $userPermissions));

        if ($hasDirectPermission) {
            return true;
        }

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
