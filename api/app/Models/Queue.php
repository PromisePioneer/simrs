<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Queue extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'queues';
    protected $fillable = [
        'tenant_id',
        'outpatient_visit_id',
        'service_unit',
        'queue_number',
        'queue_date',
        'status',
        'called_at',
        'finished_at',
    ];


    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisit::class, 'outpatient_visit_id');
    }

}
