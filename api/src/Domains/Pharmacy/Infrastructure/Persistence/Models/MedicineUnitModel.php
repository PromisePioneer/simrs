<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicineUnitModel extends Model
{
    use HasUuids;

    protected $table    = 'medicine_units';
    protected $fillable = ['medicine_id', 'unit_name', 'multiplier'];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }
}
