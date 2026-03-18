<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Models;

use Domains\Facility\Infrastructure\Persistence\Models\BedModel;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BedAssignmentModel extends Model
{
    use HasUuids;

    protected $table = 'bed_assignments';
    protected $fillable = [
        'inpatient_admission_id',
        'bed_id',
        'assigned_at',
        'transfer_reason',
        'released_at',
    ];

    public function inpatientAdmission(): BelongsTo
    {
        return $this->belongsTo(InpatientAdmissionModel::class, 'inpatient_admission_id');
    }

    public function bed(): BelongsTo
    {
        return $this->belongsTo(BedModel::class, 'bed_id');
    }
}
