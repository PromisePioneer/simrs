<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientAllergyModel extends BaseModel
{
    protected $table = 'patient_allergies';
    public $timestamps = false;
    protected $fillable = [
        'outpatient_visit_id',
        'patient_allergy',
    ];

    protected $casts = [
        'patient_allergy' => 'array',
    ];

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisitModel::class, 'outpatient_visit_id');
    }
}
