<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use App\Traits\Tenant\TenantManager;
use Illuminate\Database\Eloquent\Model;

class TenantScopeBaseModel extends Model
{
    use TenantManager;

    protected $fillable = [
        'status',
        'paid_at',
    ];

    public static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }
}
