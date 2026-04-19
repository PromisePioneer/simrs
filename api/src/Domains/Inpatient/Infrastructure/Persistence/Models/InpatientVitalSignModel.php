<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InpatientVitalSignModel extends BaseModel
{
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
