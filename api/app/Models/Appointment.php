<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'appointments';
    protected $fillable = [
        'tenant_id',
        'patient_id',
        'doctor_id',
        'poli_id',
        'date',
        'status',
        'queue_number',
        'notes'
    ];


    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }


    public function patient(): BelongsTo
    {
        return $this->belongsTo(User::class, 'patient_id');
    }
}
