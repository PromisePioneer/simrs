<?php

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class PatientCompanionModel extends BaseModel
{
    protected $table = 'patient_companions';
    protected $fillable = [
        'outpatient_visit_id',
        'full_name',
        'phone',
        'address',
    ];

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisitModel::class, 'outpatient_visit_id');
    }

}
