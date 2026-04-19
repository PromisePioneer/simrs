<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Domains\Pharmacy\Domain\Factory\MedicineModelFactory;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MedicineModel extends BaseTenantModel
{
    use HasUuids, HasFactory;

    protected $table = 'medicines';
    protected $fillable = [
        'tenant_id', 'sku', 'sequence', 'name', 'base_unit',
        'type', 'must_has_receipt', 'is_for_sell', 'category_id',
        'reference_purchase_price', 'minimum_stock_amount',
    ];
    protected $casts = ['is_published' => 'boolean'];

    /**
     * Point Laravel ke factory yang benar di dalam domain.
     */
    protected static function newFactory(): MedicineModelFactory
    {
        return MedicineModelFactory::new();
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(MedicineCategoryModel::class, 'category_id');
    }

    public function batches(): HasMany
    {
        return $this->hasMany(MedicineBatchModel::class, 'medicine_id');
    }

    public function units(): HasMany
    {
        return $this->hasMany(MedicineUnitModel::class, 'medicine_id');
    }
}
