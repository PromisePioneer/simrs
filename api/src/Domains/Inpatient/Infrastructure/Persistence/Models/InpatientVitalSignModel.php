<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Models;

use App\Models\TenantScopeBaseModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InpatientVitalSignModel extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'inpatient_vital_signs';
    protected $fillable = [
        'inpatient_admission_id',
        'temperature',
        'pulse_rate',
        'respiratory_rate',
        'systolic',
        'diastolic',
    ];

    public function inpatientAdmission(): BelongsTo
    {
        return $this->belongsTo(InpatientAdmissionModel::class, 'inpatient_admission_id');
    }
}
