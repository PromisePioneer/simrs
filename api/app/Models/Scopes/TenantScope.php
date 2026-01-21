<?php

namespace App\Models\Scopes;

use App\Models\User;
use App\Services\Tenant\TenantContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        setPermissionsTeamId(TenantContext::getId());
        if ($model instanceof User) {
            $tenantId = $this->getTenantIdForUserModel();

            if ($tenantId) {
                $builder->where($model->getTable() . '.tenant_id', $tenantId);
            }
            return;
        }

        if (!Auth::check()) {
            return;
        }

    }

    /**
     * Get tenant ID untuk UserManagement model tanpa trigger recursion.
     */
    protected function getTenantIdForUserModel(): ?string
    {
        $userId = auth()->id();

        if (!$userId) {
            return null;
        }

        return \DB::table('users')
            ->where('id', $userId)
            ->value('tenant_id');
    }
}
