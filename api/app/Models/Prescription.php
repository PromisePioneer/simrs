<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prescription extends TenantScopeBaseModel
{
    use HasUuids, SoftDeletes;

    protected $table = 'prescriptions';
    protected $fillable = [
        'tenant_id',
        'outpatient_visit_id',
        'medicine_id',
        'dosage',
        'frequency',
        'duration',
        'route',
        'quantity',
        'status',
        'notes',
        'dispensed_by',
        'dispensed_at',
    ];


    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutpatientVisit::class, 'outpatient_visit_id');
    }


    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id');
    }

    public function pharmacist(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dispensed_by');
    }
}
