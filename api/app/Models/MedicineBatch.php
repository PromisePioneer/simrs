<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MedicineBatch extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'medicine_batches';

    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'batch_number',
        'sequence',
        'is_auto_batch',
        'expired_date',
        'stock_base_unit'
    ];


    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id');
    }

    public function stock(): HasOne
    {
        return $this->hasOne(MedicineBatchStock::class, 'batch_id');
    }
}
