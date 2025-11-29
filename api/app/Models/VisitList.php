<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitList extends TenantScopeBaseModel
{


    protected $table = 'visit_list';
    protected $fillable = [
        'type',
        'referred_hospital',
        'referred_doctor',
        'patient_id',
        'doctor_id',
        'poli_id',
        'date',
        'tenant_id'
    ];


    protected $casts = [
        'date' => 'datetime'
    ];

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }


    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }


    public function poli(): BelongsTo
    {
        return $this->belongsTo(Poli::class, 'poli_id');
    }
}
