<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Models;

use App\Models\TenantScopeBaseModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InpatientDailyCareModel extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'inpatient_daily_cares';
    protected $fillable = [
        'inpatient_admission_id',
        'notes',
        'recorded_at',
    ];

    public function inpatientAdmission(): BelongsTo
    {
        return $this->belongsTo(InpatientAdmissionModel::class, 'inpatient_admission_id');
    }
}
