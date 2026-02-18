<?php

namespace App\Models;

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
}
