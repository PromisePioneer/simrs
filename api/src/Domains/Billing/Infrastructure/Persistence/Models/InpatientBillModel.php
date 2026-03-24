<?php

declare(strict_types=1);

namespace Domains\Billing\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Tagihan untuk satu admission rawat inap.
 *
 * status: draft | issued | paid | cancelled
 */
class InpatientBillModel extends BaseTenantModel
{
    protected $table    = 'inpatient_bills';
    protected $fillable = [
        'id', 'tenant_id', 'inpatient_admission_id', 'patient_id',
        'bill_number', 'status', 'subtotal', 'discount', 'tax', 'total',
        'paid_at', 'payment_method_id', 'notes',
    ];

    protected $casts = [
        'subtotal'   => 'decimal:2',
        'discount'   => 'decimal:2',
        'tax'        => 'decimal:2',
        'total'      => 'decimal:2',
        'paid_at'    => 'datetime',
    ];

    public function inpatientAdmission(): BelongsTo
    {
        return $this->belongsTo(
            \Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel::class,
            'inpatient_admission_id'
        );
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(
            \Domains\Patient\Infrastructure\Persistence\Models\PatientModel::class,
            'patient_id'
        );
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(
            \Domains\IAM\Infrastructure\Persistence\Models\PaymentMethodModel::class,
            'payment_method_id'
        );
    }

    public function items(): HasMany
    {
        return $this->hasMany(BillItemModel::class, 'inpatient_bill_id');
    }
}
