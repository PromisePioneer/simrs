<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientPsychosocialModel extends BaseModel
{
    protected $table = 'patient_psychosocial_and_spirituals';
    protected $fillable = [
        'outpatient_visit_id',
        'psychology_condition',
        'marital_status',
        'live_with',
        'job',
    ];

    protected $casts = [
        'psychology_condition' => 'array',
    ];

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisitModel::class, 'outpatient_visit_id');
    }
}
