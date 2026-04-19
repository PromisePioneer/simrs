<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Domains\Pharmacy\Domain\Factory\MedicineBatchModelFactory;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MedicineBatchModel extends BaseTenantModel
{
    use HasUuids, HasFactory;

    protected $table = 'medicine_batches';
    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'batch_number',
        'sequence',
        'is_auto_batch',
        'expired_date',
        'stock_base_unit',
        'selling_price',
    ];

    protected static function newFactory(): MedicineBatchModelFactory
    {
        return MedicineBatchModelFactory::new();
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }

    public function stock(): HasOne
    {
        return $this->hasOne(MedicineBatchStockModel::class, 'batch_id');
    }
}
