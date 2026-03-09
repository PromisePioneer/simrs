<?php

namespace App\Models;

use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poli extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'poli';

    protected $fillable = [
        'name',
        'tenant_id',
    ];

    public static function booted(): void
    {
        static::addGlobalScope(new TenantScope());
    }

}
