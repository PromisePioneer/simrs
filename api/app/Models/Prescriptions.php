<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prescriptions extends TenantScopeBaseModel
{
    use HasUuids, SoftDeletes;

    protected $table = 'prescriptions';
    protected $fillable = [
        'tenant_id',
        'outpatient_visit_id',
        'medicine_id',
        'medicine_name',
        'dosage',
        'frequency',
        'duration',
        'route',
        'quantity',
        'status',
        'notes'
    ];


    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(OutPatientVisit::class, 'outpatient_visit_id');
    }


    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id');
    }
}
