<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PatientPaymentMethod extends Model
{
    use HasUuids;

    protected $table = 'patient_payment_methods';
    protected $fillable = [
        'patient_id',
        'payment_method',
        'bpjs_number'
    ];


    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
