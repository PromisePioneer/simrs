<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicineBatchStock extends Model
{

    use HasUuids;

    public $timestamps = false;

    protected $table = 'medicine_batch_stocks';
    protected $fillable = [
        'batch_id',
        'warehouse_id',
        'rack_id',
        'stock_amount'
    ];


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
