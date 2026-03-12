<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InpatientDailyCare extends Model
{
    use HasUuids;

    protected $table = 'inpatient_daily_cares';
    protected $fillable = [
        'inpatient_admission_id',
        'doctor_id',
        'notes'
    ];

    public function inpatientAdmission(): BelongsTo
    {
        return $this->belongsTo(InpatientAdmission::class, 'inpatient_admission_id');
    }
}
