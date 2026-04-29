<?php

declare(strict_types=1);

namespace Domains\Clinical\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiagnoseModel extends BaseTenantModel
{
    protected $table = 'diagnoses';
    protected $fillable = [
        'id', 'tenant_id', 'outpatient_visit_id',
        'icd10_code', 'description', 'type', 'is_confirmed',
    ];

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(
            \Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel::class,
            'outpatient_visit_id'
        );
    }
}
