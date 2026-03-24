<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use App\Models\TenantScopeBaseModel;
use Domains\Pharmacy\Domain\Factory\MedicineBatchModelFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MedicineBatchModel extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'medicine_batches';
    protected $fillable = [
        'tenant_id', 'medicine_id', 'batch_number', 'sequence',
        'is_auto_batch', 'expired_date', 'stock_base_unit', 'selling_price',
    ];

    /**
     * Point Laravel ke factory yang benar di dalam domain.
     */
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
