<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicineBatchStockModel extends BaseModel
{
    use HasUuids;

    protected $table      = 'medicine_batch_stocks';
    public $timestamps    = false;
    protected $fillable   = ['batch_id', 'warehouse_id', 'rack_id', 'stock_amount'];

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
