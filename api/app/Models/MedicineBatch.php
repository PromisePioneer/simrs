<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicineBatch extends TenantScopeBaseModel
{
    use HasFactory, HasUuids;

    protected $table = 'medicine_batches';

    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'warehouse_id',
        'rack_id',
        'batch_number',
        'is_auto_batch',
        'expired_date',
        'stock_base_unit'
    ];


    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id');
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
