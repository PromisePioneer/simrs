<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Procedure extends TenantScopeBaseModel
{

    use HasUuids;

    protected $table = 'procedures';
    protected $fillable = [
        'tenant_id',
        'outpatient_visit_id',
        'icd9_code',
        'performed_by',
        'procedure_date',
        'description'
    ];


    public function outPatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutPatientVisit::class, 'outpatient_visit_id');
    }

}
