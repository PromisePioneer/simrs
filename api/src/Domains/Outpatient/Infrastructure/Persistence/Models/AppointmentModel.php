<?php

declare(strict_types=1);

namespace Domains\Outpatient\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppointmentModel extends BaseTenantModel
{
    protected $table    = 'appointments';
    protected $fillable = [
        'id', 'tenant_id', 'patient_id', 'doctor_id', 'poli_id',
        'date', 'status', 'queue_number', 'notes',
    ];

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'doctor_id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(\App\Models\Patient::class, 'patient_id');
    }
}
