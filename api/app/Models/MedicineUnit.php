<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicineUnit extends Model
{
    protected $table = 'medicine_units';
    protected $fillable = [
        'medicine_id',
        'unit_name',
        'multiplier'
    ];


    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id');
    }
}
