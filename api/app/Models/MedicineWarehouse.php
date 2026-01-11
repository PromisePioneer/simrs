<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineWarehouse extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'medicine_warehouses';
    protected $fillable = [
        'tenant_id',
        'code',
        'name'
    ];


    public function racks(): HasMany
    {
        return $this->hasMany(MedicineRack::class, 'warehouse_id');
    }
}
