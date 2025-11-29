<?php

namespace App\Traits\Tenant;

use App\Models\Scopes\TenantScope;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait TenantManager
{
    protected static function bootTenantManager(): void
    {
        static::creating(function (Model $model) {
            if (Auth::check() && !$model->tenant_id) {
                $model->tenant_id = Auth::user()->tenant_id;
                setPermissionsTeamId($model->tenant_id);
            }
        });
    }


    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
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
