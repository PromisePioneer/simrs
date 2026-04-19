<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientFamilyMedicalHistoryModel extends BaseModel
{
    protected $table = 'patient_family_medical_history';
    public $timestamps = false;
    protected $fillable = [
        'outpatient_visit_id',
        'family_medical_history',
    ];

    protected $casts = [
        'family_medical_history' => 'array',
    ];

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisitModel::class, 'outpatient_visit_id');
    }
}
