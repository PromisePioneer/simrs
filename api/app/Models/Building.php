<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Building extends TenantScopeBaseModel
{
    use HasUuids, SoftDeletes;

    protected $table = 'buildings';
    protected $fillable = [

        'tenant_id',
        'building_id',
        'department_id',
        'name',
        'description',
    ];


    public function wards(): HasMany
    {
        return $this->hasMany(Ward::class, 'building_id');
    }


    public function departments(): HasMany
    {
        return $this->hasMany(Department::class, 'department_id');
    }
}
