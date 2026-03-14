<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BedAssignment extends Model
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
        return $this->belongsTo(InpatientAdmission::class, 'inpatient_admission_id');
    }


    public function bed(): BelongsTo
    {
        return $this->belongsTo(Bed::class, 'bed_id');
    }
}
