<?php

namespace App\Traits\Tenant;

use App\Models\Tenant;
use App\Services\Tenant\TenantContext;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Domains\Tenant\Infrastructure\Persistence\Models\Scopes\TenantScope;

trait HasActiveTenant
{
    public function hasActivePermission($permission): bool
    {
        if (session()->has('active_role_id')) {
            $activeRole = RoleModel::where('uuid', session('active_role_id'))->first();

            if ($activeRole) {
                return $activeRole->hasPermissionTo($permission);
            }
        }

        return $this->hasPermissionTo($permission);
    }

    public function getActiveRole(): ?object
    {
        setPermissionsTeamId(TenantContext::getId());

        if (session()->has('active_role_id')) {
            $activeRoleId = session('active_role_id');

            $role = RoleModel::where('uuid', $activeRoleId)->first();

            if ($role) {
                return $role;
            }

            // Fallback: coba tanpa TenantScope
            $roleWithoutScope = RoleModel::withoutGlobalScope(TenantScope::class)
                ->where('uuid', $activeRoleId)
                ->first();

            if ($roleWithoutScope) {
                return $roleWithoutScope;
            }
        }

        return $this->roles->first();
    }

    public function hasActiveRole($role): bool
    {
        $activeRole = $this->getActiveRole();

        if (is_string($role)) {
            return $activeRole && $activeRole->name === $role;
        }

        return $activeRole && $activeRole->id === $role->id;
    }

    public function getActiveTenantId(): ?string
    {
        return session('active_tenant_id') ?? $this->tenant_id;
    }

    public function isSwitchedContext(): bool
    {
        return session()->has('active_tenant_id') || session()->has('active_role_id');
    }

    public function getActivePermissions(): object
    {
        $activeRole = $this->getActiveRole();

        if ($activeRole) {
            return $activeRole->permissions;
        }

        return $this->getAllPermissions();
    }

    public function getActivePermissionNames(): array
    {
        return $this->getActivePermissions()->pluck('name')->toArray();
    }

    public function getActiveRoleNames(): array
    {
        $activeRole = $this->getActiveRole();

        if ($activeRole) {
            return [$activeRole->name];
        }

        return $this->getRoleNames()->toArray();
    }

    public function getActiveTenant(): ?object
    {
        $tenantId = $this->getActiveTenantId();

        if (!$tenantId) {
            return null;
        }

        return Tenant::query()->find($tenantId);
    }

    public function getCurrentTenantPlan(): ?object
    {
        $tenant = $this->getActiveTenant();

        if (!$tenant) {
            return null;
        }

        return $tenant->getCurrentPlan();
    }

    public function getActiveUserData(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'roles' => $this->getActiveRoleNames(),
            'permissions' => $this->getActivePermissionNames(),
            'tenant' => $this->getActiveTenant(),
            'is_switched' => $this->isSwitchedContext(),
        ];
    }

    // TODO: FOR DEBUGGING
    public function getContextInfo(): array
    {
        $activeRole = $this->getActiveRole();
        $originalRole = $this->roles->first();

        return [
            'original' => [
                'tenant_id' => $this->tenant_id,
                'role' => $originalRole?->name,
            ],
            'active' => [
                'tenant_id' => $this->getActiveTenantId(),
                'role' => $activeRole?->name,
            ],
            'is_switched' => $this->isSwitchedContext(),
        ];
    }
}
