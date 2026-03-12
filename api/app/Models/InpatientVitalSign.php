<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InpatientVitalSign extends Model
{

    use HasUuids;

    protected $table = 'inpatient_vital_signs';

    protected $fillable = [
        'inpatient_admission_id',
        'temperature',
        'pulse_rate',
        'respiratory_rate',
        'systolic',
        'diastolic'
    ];


    public function inpatientAdmission(): BelongsTo
    {
        return $this->belongsTo(InpatientAdmission::class, 'inpatient_admission_id');
    }
}
