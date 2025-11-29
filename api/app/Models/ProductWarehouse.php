<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductWarehouse extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'product_warehouses';
    protected $fillable = [
        'tenant_id',
        'code',
        'name'
    ];


    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'product_warehouse_id');
    }
}
