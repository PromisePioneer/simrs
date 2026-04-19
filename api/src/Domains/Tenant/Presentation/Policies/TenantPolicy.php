<?php

declare(strict_types=1);

namespace Domains\Tenant\Presentation\Policies;

use App\Models\User;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Illuminate\Auth\Access\HandlesAuthorization;

class TenantPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasRole('Super Admin')
            || $user->hasPermissionTo('Melihat list tenant');
    }

    public function view(User $user, TenantModel $tenant): bool
    {
        return $user->hasRole('Super Admin')
            || $user->tenant_id === $tenant->id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Super Admin');
    }

    public function update(User $user, TenantModel $tenant): bool
    {
        return $user->hasRole('Super Admin')
            || $user->tenant_id === $tenant->id;
    }

    public function delete(User $user, TenantModel $tenant): bool
    {
        return $user->hasRole('Super Admin');
    }
}
