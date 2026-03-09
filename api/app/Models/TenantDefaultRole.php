<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TenantDefaultRole extends Model
{

    use HasFactory, HasUuids;

    protected $table = 'tenant_default_roles';
    protected $fillable = [
        'name',
        'guard_name',
    ];

}
