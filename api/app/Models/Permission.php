<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use App\Traits\Tenant\TenantManager;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as SpatiePermission;


class Permission extends SpatiePermission
{
    use HasUuids, HasFactory;

    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected string $guard_name = 'sanctum';
    protected $hidden = ['pivot'];


    protected $fillable = [
        'name',
        'guard_name',
        'module_id',
    ];
}
