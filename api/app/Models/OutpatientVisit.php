<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OutpatientVisit extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'outpatient_visits';


    protected $fillable = [
        'tenant_id',
        'type',
        'referred_hospital',
        'referred_doctor',
        'patient_id',
        'doctor_id',
        'poli_id',
        'date'
    ];


    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }


    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }


    public function poli(): BelongsTo
    {
        return $this->belongsTo(Poli::class, 'poli_id');
    }


    public function vitalSign(): HasOne
    {
        return $this->hasOne(PatientVitalSign::class, 'outpatient_visit_id');
    }
}
