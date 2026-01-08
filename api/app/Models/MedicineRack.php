<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineRack extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'medicine_racks';
    protected $primaryKey = 'id';
    protected $fillable = [
        'tenant_id',
        'warehouse_id'
        'code',
        'name'
    ];


    public function products(): HasMany
    {
        return $this->hasMany(Medicine::class, 'product_warehouse_id');
    }
}
