<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Medicine extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;


    protected $table = 'medicines';
    protected $fillable = [
        'tenant_id',
        'sku',
        'sequence',
        'name',
        'base_unit',
        'type',
        'must_has_receipt',
        'is_for_sell',
        'category_id',
        'reference_purchase_price',
        'minimum_stock_amount'
    ];


    protected $casts = [
        'is_published' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MedicineCategory::class, 'category_id');
    }

    public function batches(): HasMany
    {
        return $this->hasMany(MedicineBatch::class, 'medicine_id');
    }


    public function units(): HasMany
    {
        return $this->hasMany(MedicineUnit::class, 'medicine_id');
    }
}
