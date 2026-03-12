<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class InpatientAdmission extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'inpatient_admissions';
    protected $fillable = [
        'tenant_id',
        'doctor_id',
        'patient_id',
        'admitted_at',
        'discharged_at',
        'admission_source',
        'status',
        'diagnosis',
    ];

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function bedAssignments(): HasMany
    {
        return $this->hasMany(BedAssignment::class, 'inpatient_admission_id');
    }


    public function vitalSigns(): HasMany
    {
        return $this->hasMany(InpatientVitalSign::class, 'inpatient_admission_id');
    }
}
