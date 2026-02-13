<?php

namespace App\Models\Scopes;

use App\Models\User;
use App\Models\Role;
use App\Services\Tenant\TenantContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class TenantScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $tenantId = TenantContext::getId();
        setPermissionsTeamId($tenantId);

        // Jika tidak ada tenant ID, skip filter
        if (!$tenantId) {
            return;
        }

        // Handle User model secara khusus (untuk avoid recursion)
        if ($model instanceof User) {
            $tenantId = $this->getTenantIdForUserModel();
            if ($tenantId) {
                $builder->where($model->getTable() . '.tenant_id', $tenantId);
            }
            return;
        }

        // Handle Role model - izinkan global roles (tenant_id = null)
        if ($model instanceof Role) {
            $builder->where(function ($query) use ($model, $tenantId) {
                $query->whereNull($model->getTable() . '.tenant_id')
                    ->orWhere($model->getTable() . '.tenant_id', $tenantId);
            });
            return;
        }

        // Filter semua model lain berdasarkan tenant_id
        $builder->where($model->getTable() . '.tenant_id', $tenantId);
    }

    /**
     * Get tenant ID untuk User model tanpa trigger recursion.
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
