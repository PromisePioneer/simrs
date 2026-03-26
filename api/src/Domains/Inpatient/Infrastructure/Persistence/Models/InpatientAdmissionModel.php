<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InpatientAdmissionModel extends BaseTenantModel
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
        return $this->belongsTo(\App\Models\User::class, 'doctor_id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(\Domains\Patient\Infrastructure\Persistence\Models\PatientModel::class, 'patient_id');
    }

    public function bedAssignments(): HasMany
    {
        return $this->hasMany(BedAssignmentModel::class, 'inpatient_admission_id');
    }

    public function vitalSigns(): HasMany
    {
        return $this->hasMany(InpatientVitalSignModel::class, 'inpatient_admission_id');
    }

    public function dailyCares(): HasMany
    {
        return $this->hasMany(InpatientDailyCareModel::class, 'inpatient_admission_id');
    }
}
