<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Diagnose extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'diagnoses';

    protected $fillable = [
        'tenant_id',
        'outpatient_visit_id',
        'icd10_code',
        'description',
        'is_confirmed',
    ];


    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutPatientVisit::class, 'outpatient_visit_id');
    }

}
