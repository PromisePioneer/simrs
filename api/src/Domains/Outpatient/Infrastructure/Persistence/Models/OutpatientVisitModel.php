<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class OutpatientVisitModel extends BaseTenantModel
{
    protected $table    = 'outpatient_visits';
    protected $fillable = [
        'id', 'tenant_id', 'type', 'referred_hospital', 'referred_doctor',
        'patient_id', 'doctor_id', 'poli_id', 'date', 'complain', 'status',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Patient::class, 'patient_id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'doctor_id');
    }

    public function vitalSign(): HasOne
    {
        return $this->hasOne(\App\Models\PatientVitalSign::class, 'outpatient_visit_id');
    }

    public function diagnoses(): HasMany
    {
        return $this->hasMany(\Domains\Clinical\Infrastructure\Persistence\Models\DiagnoseModel::class, 'outpatient_visit_id');
    }

    public function procedures(): HasMany
    {
        return $this->hasMany(\App\Models\Procedure::class, 'outpatient_visit_id');
    }

    public function prescriptions(): HasMany
    {
        return $this->hasMany(\Domains\Clinical\Infrastructure\Persistence\Models\PrescriptionModel::class, 'outpatient_visit_id');
    }

    public function queue(): HasOne
    {
        return $this->hasOne(QueueModel::class, 'outpatient_visit_id');
    }
}
