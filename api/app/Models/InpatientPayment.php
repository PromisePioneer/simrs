<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InpatientPayment extends TenantScopeBaseModel
{
    protected $table = 'inpatient_payments';


    protected $fillable = [
        'tenant_id',
        'inpatient_admission_id',
        'invoice_number',
        'subtotal',
        'tax',
        'total',
        'payment_status'
    ];


    public function inpatientAdmission(): BelongsTo
    {
        return $this->belongsTo(InpatientAdmission::class, 'inpatient_admission_id');
    }

}
