<?php

declare(strict_types=1);

namespace Domains\Clinical\Infrastructure\Persistence\Models;

use App\Models\User;
use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProcedureModel extends BaseTenantModel
{
    protected $table = 'procedures';
    protected $fillable = [
        'id', 'tenant_id', 'outpatient_visit_id',
        'icd9_code', 'name', 'description',
        'performed_by', 'procedure_date', 'notes',
    ];

    protected $casts = ['procedure_date' => 'datetime'];

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(
            OutpatientVisitModel::class,
            'outpatient_visit_id'
        );
    }

    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
