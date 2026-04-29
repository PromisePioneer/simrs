<?php

declare(strict_types=1);

namespace Domains\Billing\Infrastructure\Persistence\Models;

use Domains\Tenant\Infrastructure\Persistence\Models\BaseTenantModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Line item tagihan.
 *
 * item_type: consultation | medicine | room | procedure | other
 *
 * Satu bill item bisa terhubung ke:
 *   - medicine_batch_id  (pemakaian obat dari stok)
 *   - bill_id            (rawat jalan)
 *   - inpatient_bill_id  (rawat inap)
 */
class BillItemModel extends BaseTenantModel
{
    protected $table    = 'bill_items';
    protected $fillable = [
        'id', 'tenant_id',
        'bill_id', 'inpatient_bill_id',
        'item_type', 'description',
        'quantity', 'unit_price', 'subtotal',
        'medicine_batch_id',
    ];

    protected $casts = [
        'quantity'   => 'integer',
        'unit_price' => 'decimal:2',
        'subtotal'   => 'decimal:2',
    ];

    public function outpatientBill(): BelongsTo
    {
        return $this->belongsTo(OutpatientBillModel::class, 'bill_id');
    }

    public function inpatientBill(): BelongsTo
    {
        return $this->belongsTo(InpatientBillModel::class, 'inpatient_bill_id');
    }

    public function medicineBatch(): BelongsTo
    {
        return $this->belongsTo(
            \Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel::class,
            'medicine_batch_id'
        );
    }
}
