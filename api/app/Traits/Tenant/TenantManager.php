<?php

namespace App\Traits\Tenant;

use App\Models\Scopes\TenantScope;
use App\Models\User;
use App\Services\Tenant\TenantContext;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait TenantManager
{
    protected static function bootTenantManager(): void
    {
        static::creating(function (Model $model) {
            if (Auth::check() && !$model->tenant_id) {
                $model->tenant_id = TenantContext::getId();
                setPermissionsTeamId($model->tenant_id);
            }
        });
    }

    public function scopeWithoutTenant($query)
    {
        return $query->withoutGlobalScope(TenantScope::class);
    }

    public function scopeForTenant($query, $tenantId)
    {
        return $query->withoutGlobalScope(TenantScope::class)
            ->where('tenant_id', $tenantId);
    }
}
