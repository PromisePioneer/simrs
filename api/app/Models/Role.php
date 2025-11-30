<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use App\Traits\Tenant\TenantManager;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Query\Builder;
use Spatie\Permission\Models\Role as SpatieRole;
use Spatie\Permission\PermissionRegistrar;


class Role extends SpatieRole
{
    use HasUuids, TenantManager, HasFactory;

    protected $primaryKey = 'uuid';
    protected $keyType = 'string';
    public $incrementing = false;

    protected string $guard_name = 'sanctum';
    protected $hidden = ['pivot'];

    protected $fillable = [
        'name',
        'guard_name',
        'tenant_id'
    ];

    public static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }


    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
    }

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }
}

