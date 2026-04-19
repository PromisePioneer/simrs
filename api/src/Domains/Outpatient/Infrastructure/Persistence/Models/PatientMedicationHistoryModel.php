<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientMedicationHistoryModel extends BaseModel
{
    protected $table = 'patient_medication_history';
    public $timestamps = false;
    protected $fillable = [
        'outpatient_visit_id',
        'medication_history',
    ];

    protected $casts = [
        'medication_history' => 'array',
    ];

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisitModel::class, 'outpatient_visit_id');
    }
}
