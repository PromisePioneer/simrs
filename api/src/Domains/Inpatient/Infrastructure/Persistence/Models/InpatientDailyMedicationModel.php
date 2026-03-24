<?php

declare(strict_types=1);

namespace Domains\Inpatient\Infrastructure\Persistence\Models;

use App\Models\Medicine;
use App\Models\User;
use Domains\Inpatient\Domain\Enum\InpatientMedicationStatus;
use Domains\Shared\Infrastructure\Persistence\Models\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class InpatientDailyMedicationModel extends BaseModel
{
    use SoftDeletes;

    protected $table = 'inpatient_daily_medications';

    protected $fillable = [
        'tenant_id',
        'inpatient_admission_id',
        'medicine_id',
        'prescribed_by',
        'dispensed_by',
        'dosage',
        'frequency',
        'route',
        'quantity',
        'status',
        'notes',
        'dispensed_at',
        'given_date',
    ];

    protected $casts = [
        'status' => InpatientMedicationStatus::class,
        'given_date' => 'date',
        'dispensed_at' => 'datetime',
    ];

    public function inpatientAdmission(): BelongsTo
    {
        return $this->belongsTo(InpatientAdmissionModel::class, 'inpatient_admission_id');
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(Medicine::class, 'medicine_id');
    }

    public function prescribedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prescribed_by');
    }

    public function dispensedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dispensed_by');
    }
}
