<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Department extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'departments';
    protected $fillable = [
        'tenant_id',
        'name',
        'description',
    ];
}
