<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicineStockMovementModel extends BaseTenantModel
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
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(MedicineBatchModel::class, 'batch_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(MedicineWarehouseModel::class, 'warehouse_id');
    }

    public function rack(): BelongsTo
    {
        return $this->belongsTo(MedicineRackModel::class, 'rack_id');
    }
}
