<?php

namespace Domains\Clinical\Infrastructure\Persistence\Models;

use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Domains\Patient\Infrastructure\Persistence\Models\PatientModel;
use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientVitalSignModel extends BaseModel
{
    protected $table = 'patients_vital_sign';
    protected $fillable = [
        'outpatient_visit_id',
        'patient_id',
        'height',
        'weight',
        'temperature',
        'pulse_rate',
        'systolic',
        'diastolic',
        'abdominal_circumference',
        'blood_sugar',
        'oxygen_saturation',
    ];


    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisitModel::class, 'outpatient_visit_id');
    }


    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientModel::class, 'patient_id');
    }
}
