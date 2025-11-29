<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductUnitType extends TenantScopeBaseModel
{

    use HasUuids, HasFactory;

    protected $table = 'product_unit_types';

    protected $fillable = [
        'tenant_id',
        'code',
        'name'
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'unit_type_id');
    }
}
