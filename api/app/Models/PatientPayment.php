<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PatientPayment extends TenantScopeBaseModel
{
    use HasUuids;

    protected $table = 'patient_payment';
    protected $fillable = [
        'tenant_id',
        'outpatient_visit_id',
        'invoice_number',
        'subtotal',
        'discount',
        'tax',
        'total',
        'amount_paid',
        'payment_status',
        'payment_method',
        'paid_at'
    ];


}
