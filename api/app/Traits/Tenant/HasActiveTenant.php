<?php

namespace App\Traits\Tenant;

use App\Models\Role;
use App\Models\Tenant;

trait HasActiveTenant
{
    public function hasActivePermission($permission): bool
    {
        // Jika ada active role di session
        if (session()->has('active_role_id')) {
            $activeRole = Role::where('uuid', session('active_role_id'))->first();

            if ($activeRole) {
                return $activeRole->hasPermissionTo($permission);
            }
        }

        return $this->hasPermissionTo($permission);
    }

    public function getActiveRole(): object
    {
        if (session()->has('active_role_id')) {
            return Role::where('uuid', session('active_role_id'))->first();
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

    public function getActiveTenant(): object
    {
        $tenantId = $this->getActiveTenantId();
        return Tenant::query()->find($tenantId);
    }


    public function getCurrentTenantPlan()
    {
        $tenantId = $this->getActiveTenantId();
        return Tenant::query()->find($tenantId)->getCurrentPlan();
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


    #TODO: FOR DEBUGGING
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
