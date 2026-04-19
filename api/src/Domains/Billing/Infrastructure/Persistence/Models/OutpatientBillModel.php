<?php

declare(strict_types=1);

namespace Domains\Billing\Infrastructure\Persistence\Models;

use Domains\Shared\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Tagihan untuk satu kunjungan rawat jalan.
 *
 * status: draft | issued | paid | cancelled
 */
class OutpatientBillModel extends BaseTenantModel
{
    protected $table    = 'outpatient_bills';
    protected $fillable = [
        'id', 'tenant_id', 'outpatient_visit_id', 'patient_id',
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

    public function outpatientVisit(): BelongsTo
    {
        return $this->belongsTo(
            \Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel::class,
            'outpatient_visit_id'
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
            \Domains\MasterData\Infrastructure\Persistent\Models\PaymentMethodModel::class,
            'payment_method_id'
        );
    }

    public function items(): HasMany
    {
        return $this->hasMany(BillItemModel::class, 'bill_id');
    }
}
