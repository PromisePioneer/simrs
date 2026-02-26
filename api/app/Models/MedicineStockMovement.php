<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicineStockMovement extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'medicine_stock_movements';
    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'batch_id',
        'warehouse_id',
        'rack_id',
        'type',
        'quantity',
        'reference_type',
        'reference_id',
        'notes',
        'stock_before',
        'stock_after',
    ];


    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id');
    }


    public function batch(): BelongsTo
    {
        return $this->belongsTo(MedicineBatch::class, 'batch_id');
    }


    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(MedicineWarehouse::class, 'warehouse_id');
    }


    public function rack(): BelongsTo
    {
        return $this->belongsTo(MedicineRack::class, 'rack_id');
    }
}
