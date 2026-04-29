<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QueueModel extends BaseTenantModel
{
    protected $table = 'queues';
    protected $fillable = [
        'id', 'tenant_id', 'outpatient_visit_id', 'service_unit',
        'queue_number', 'queue_date', 'status', 'called_at', 'finished_at',
    ];

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisitModel::class, 'outpatient_visit_id');
    }
}
