<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\ScopedBy;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Patient extends TenantScopeBaseModel
{
    use HasUuids, HasFactory;

    protected $table = 'patients';
    protected $fillable = [
        'full_name',
        'tenant_id',
        'medical_record_number',
        'city_of_birth',
        'date_of_birth',
        'id_card_number',
        'gender',
        'religion',
        'blood_type',
        'job',
        'phone',
        'email',
        'date_of_consultation',
        'profile_picture'
    ];


    public function paymentMethods(): HasMany
    {
        return $this->hasMany(PatientPaymentMethod::class, 'patient_id');
    }


    public function addresses(): hasMany
    {
        return $this->hasMany(PatientAddress::class, 'patient_id');
    }
}
