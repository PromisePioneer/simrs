<?php

declare(strict_types=1);

namespace Domains\Tenant\Application\Traits;

use Domains\Tenant\Infrastructure\Persistence\Models\Scopes\TenantScope;
use Domains\Tenant\Infrastructure\Services\TenantContext;
use Illuminate\Database\Eloquent\Model;
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
