<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Domains\Patient\Infrastructure\Persistence\Models\PatientModel;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentModel extends BaseTenantModel
{
    use HasUuids;

    protected $table = 'appointments';

    protected $fillable = [
        'id',
        'tenant_id',
        'patient_id',
        'outpatient_visit_id',
        'inpatient_admission_id',
        'visit_number',
        'reg_number',
        'date',
        'emr',
        'guarantor_name',
        'guarantor_address',
        'guarantor_relationship',
        'registration_fee',
        'status',
        'registration_status',
        'advanced_status',
    ];

    protected $casts = [
        'date' => 'datetime',
        'birth_date' => 'date',
        'registration_fee' => 'float',
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(PatientModel::class, 'patient_id');
    }

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisitModel::class, 'outpatient_visit_id');
    }

    public function inpatientAdmission(): BelongsTo
    {
        return $this->belongsTo(InpatientAdmissionModel::class, 'inpatient_admission_id');
    }
}
