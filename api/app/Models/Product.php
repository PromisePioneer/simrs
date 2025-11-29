<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;


    protected $table = 'products';

    protected $fillable = [
        'tenant_id',
        'sku',
        'name',
        'code',
        'must_has_receipt',
        'type',
        'warehouse_id',
        'category_id',
        'rack_id',
        'is_for_sell',
        'expired_date',
        'expired_notification_days',
        'stock_amount',
        'minimum_stock_amount',
        'reference_purchase_price',
        'unit_type_id'
    ];


    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(ProductWarehouse::class, 'warehouse_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'category_id');
    }

    public function rack(): BelongsTo
    {
        return $this->belongsTo(ProductRack::class, 'rack_id');
    }


    public function getTypes(): array
    {
        return [
            'general', 'medicine', 'medical_devices', 'service'
        ];
    }
}
