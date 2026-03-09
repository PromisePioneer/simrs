<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientVitalSign extends Model
{
    use HasUuids, HasFactory;

    protected $table = 'patients_vital_sign';
    protected $fillable = [
        'outpatient_visit_id',
        'patient_id',
        'height',
        'weight',
        'temperature',
        'pulse_rate',
        'respiratory_frequency',
        'systolic',
        'diastolic',
        'abdominal_circumference',
        'blood_sugar',
        'oxygen_saturation'
    ];


    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutPatientVisit::class, 'outpatient_visit_id');
    }


    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
