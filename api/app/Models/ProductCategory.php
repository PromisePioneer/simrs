<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductCategory extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'product_categories';
    protected $fillable = [
        'tenant_id',
        'code',
        'name',
        'type'
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
