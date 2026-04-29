<?php

declare(strict_types=1);

namespace Domains\Clinical\Infrastructure\Persistence\Models;

use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PrescriptionModel extends BaseTenantModel
{
    use SoftDeletes;

    protected $table = 'prescriptions';
    protected $fillable = [
        'id', 'tenant_id', 'outpatient_visit_id', 'medicine_id',
        'dosage', 'frequency', 'duration', 'route', 'quantity',
        'status', 'notes', 'dispensed_by', 'dispensed_at',
    ];

    protected $casts = ['dispensed_at' => 'datetime'];

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(
            \Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel::class,
            'outpatient_visit_id'
        );
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }

    public function pharmacist(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'dispensed_by');
    }
}
