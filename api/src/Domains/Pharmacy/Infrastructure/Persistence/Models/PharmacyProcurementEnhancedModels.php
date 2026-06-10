<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * PharmacyPurchaseOrder Model
 * 
 * Represents a purchase order for pharmacy procurement
 * Workflow: draft → submitted → reviewed → approved → confirmed → received
 */
class PharmacyPurchaseOrder extends Model
{
    use SoftDeletes;

    protected $table = 'pharmacy_purchase_orders';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'tenant_id',
        'po_number',
        'supplier_id',
        'warehouse_id',
        'po_date',
        'expected_delivery_date',
        'status',
        'delivery_status',
        'total_amount',
        'total_discount',
        'total_tax',
        'grand_total',
        'payment_terms',
        'delivery_address',
        'submitted_at',
        'submitted_by',
        'reviewed_at',
        'reviewed_by',
        'approved_at',
        'approved_by',
        'confirmed_at',
        'confirmed_by',
        'rejected_at',
        'rejected_by',
        'rejection_reason',
        'cancelled_at',
        'cancelled_by',
        'cancellation_reason',
        'actual_delivery_date',
        'tracking_number',
        'delivery_notes',
        'delivery_status_updated_at',
        'supplier_po_number',
        'supplier_contact',
        'submission_notes',
        'approval_notes',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'po_date' => 'date',
        'expected_delivery_date' => 'date',
        'actual_delivery_date' => 'date',
        'total_amount' => 'decimal:2',
        'total_discount' => 'decimal:2',
        'total_tax' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'rejected_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'delivery_status_updated_at' => 'datetime',
    ];

    protected $appends = ['is_draft', 'is_pending_approval', 'is_confirmed', 'days_until_delivery'];

    // ====================================================================
    // RELATIONSHIPS
    // ====================================================================

    public function items()
    {
        return $this->hasMany(PharmacyPurchaseOrderItem::class, 'po_id', 'id');
    }

    public function goodsReceipts()
    {
        return $this->hasMany(PharmacyGoodsReceipt::class, 'po_id', 'id');
    }

    public function supplier()
    {
        return $this->belongsTo(PharmacySupplier::class, 'supplier_id', 'id');
    }

    public function warehouse()
    {
        return $this->belongsTo(MedicineWarehouseModel::class, 'warehouse_id', 'id');
    }

    public function submittedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'submitted_by', 'id');
    }

    public function approvedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'approved_by', 'id');
    }

    public function confirmedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'confirmed_by', 'id');
    }

    // ====================================================================
    // ACCESSORS
    // ====================================================================

    public function getIsDraftAttribute(): bool
    {
        return $this->status === 'draft';
    }

    public function getIsPendingApprovalAttribute(): bool
    {
        return in_array($this->status, ['submitted', 'reviewed']);
    }

    public function getIsConfirmedAttribute(): bool
    {
        return in_array($this->status, ['confirmed', 'received', 'partial_received']);
    }

    public function getDaysUntilDeliveryAttribute(): ?int
    {
        if (!$this->expected_delivery_date) {
            return null;
        }
        return now()->diffInDays($this->expected_delivery_date);
    }

    // ====================================================================
    // SCOPES
    // ====================================================================

    public function scopeForTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeSubmitted($query)
    {
        return $query->where('status', 'submitted');
    }

    public function scopePendingApproval($query)
    {
        return $query->whereIn('status', ['submitted', 'reviewed']);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeReceived($query)
    {
        return $query->whereIn('status', ['received', 'partial_received']);
    }

    public function scopeOverdue($query)
    {
        return $query->where('expected_delivery_date', '<', now()->toDateString())
            ->whereNotIn('status', ['received', 'cancelled']);
    }
}

/**
 * PharmacyPurchaseOrderItem Model
 * 
 * Line items in a purchase order
 */
class PharmacyPurchaseOrderItem extends Model
{
    protected $table = 'pharmacy_purchase_order_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'po_id',
        'medicine_id',
        'quantity_ordered',
        'quantity_received',
        'unit_price',
        'line_total',
        'notes',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'line_total' => 'decimal:2',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PharmacyPurchaseOrder::class, 'po_id', 'id');
    }

    public function medicine()
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id', 'id');
    }

    public function receiptItems()
    {
        return $this->hasMany(PharmacyReceiptItem::class, 'po_item_id', 'id');
    }
}

/**
 * PharmacyGoodsReceipt Model
 * 
 * Goods Receipt Note (GRN) for received items
 */
class PharmacyGoodsReceipt extends Model
{
    use SoftDeletes;

    protected $table = 'pharmacy_goods_receipts';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'tenant_id',
        'grn_number',
        'po_id',
        'supplier_id',
        'warehouse_id',
        'receipt_date',
        'status',
        'inspection_status',
        'quality_inspection_notes',
        'total_items',
        'total_received',
        'variance_items',
        'total_amount',
        'received_by_user_id',
        'finalized_by',
        'posted_by',
        'received_at',
        'finalized_at',
        'posted_at',
        'notes',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'receipt_date' => 'date',
        'quality_inspection_notes' => 'json',
        'received_at' => 'datetime',
        'finalized_at' => 'datetime',
        'posted_at' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    protected $appends = ['has_variances', 'is_fully_received', 'inspection_passed'];

    public function items()
    {
        return $this->hasMany(PharmacyReceiptItem::class, 'grn_id', 'id');
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PharmacyPurchaseOrder::class, 'po_id', 'id');
    }

    public function supplier()
    {
        return $this->belongsTo(PharmacySupplier::class, 'supplier_id', 'id');
    }

    public function warehouse()
    {
        return $this->belongsTo(MedicineWarehouseModel::class, 'warehouse_id', 'id');
    }

    public function receivedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'received_by_user_id', 'id');
    }

    public function qualityInspections()
    {
        return $this->hasMany(PharmacyQualityInspection::class, 'grn_id', 'id');
    }

    public function variances()
    {
        return $this->hasMany(PharmacyReceiptVariance::class, 'grn_id', 'id');
    }

    // Accessors
    public function getHasVariancesAttribute(): bool
    {
        return $this->variance_items > 0;
    }

    public function getIsFullyReceivedAttribute(): bool
    {
        return $this->variance_items === 0;
    }

    public function getInspectionPassedAttribute(): bool
    {
        return $this->inspection_status === 'passed';
    }

    // Scopes
    public function scopeForTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    public function scopeFinalized($query)
    {
        return $query->where('status', 'finalized');
    }

    public function scopeWithVariances($query)
    {
        return $query->where('variance_items', '>', 0);
    }
}

/**
 * PharmacyReceiptItem Model
 * 
 * Individual items received in a GRN
 */
class PharmacyReceiptItem extends Model
{
    protected $table = 'pharmacy_receipt_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'grn_id',
        'po_item_id',
        'medicine_id',
        'batch_number',
        'expiry_date',
        'quantity_ordered',
        'quantity_received',
        'variance',
        'unit_price',
        'line_total',
        'condition_status',
        'notes',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'unit_price' => 'decimal:2',
        'line_total' => 'decimal:2',
    ];

    protected $appends = ['is_expired', 'variance_percentage'];

    public function goodsReceipt()
    {
        return $this->belongsTo(PharmacyGoodsReceipt::class, 'grn_id', 'id');
    }

    public function medicine()
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id', 'id');
    }

    public function poItem()
    {
        return $this->belongsTo(PharmacyPurchaseOrderItem::class, 'po_item_id', 'id');
    }

    // Accessors
    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date <= now()->toDateString();
    }

    public function getVariancePercentageAttribute(): float
    {
        if ($this->quantity_ordered === 0) {
            return 0;
        }
        return round(($this->variance / $this->quantity_ordered) * 100, 2);
    }

    // Scopes
    public function scopeExpiringSoon($query, int $days = 30)
    {
        return $query->whereBetween('expiry_date', [
            now()->toDateString(),
            now()->addDays($days)->toDateString(),
        ]);
    }

    public function scopeExpired($query)
    {
        return $query->where('expiry_date', '<', now()->toDateString());
    }

    public function scopeWithVariance($query)
    {
        return $query->whereNotIn('variance', [0]);
    }
}

/**
 * PharmacyQualityInspection Model
 * 
 * Quality inspection records for GRN items
 */
class PharmacyQualityInspection extends Model
{
    protected $table = 'pharmacy_quality_inspections';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'tenant_id',
        'grn_id',
        'inspection_type',
        'status',
        'inspection_findings',
        'inspection_notes',
        'items_passed',
        'items_rejected',
        'items_partial',
        'inspected_by',
        'inspected_at',
        'approved_by',
        'approved_at',
        'approval_notes',
        'rejected_by',
        'rejected_at',
        'rejection_reason',
    ];

    protected $casts = [
        'inspection_findings' => 'json',
        'inspected_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    public function goodsReceipt()
    {
        return $this->belongsTo(PharmacyGoodsReceipt::class, 'grn_id', 'id');
    }

    public function inspectedBy()
    {
        return $this->belongsTo(\App\Models\User::class, 'inspected_by', 'id');
    }
}

/**
 * PharmacyReceiptVariance Model
 * 
 * Tracking variances during receipt
 */
class PharmacyReceiptVariance extends Model
{
    protected $table = 'pharmacy_receipt_variances';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'tenant_id',
        'receipt_item_id',
        'grn_id',
        'quantity_ordered',
        'quantity_received',
        'variance_quantity',
        'variance_type',
        'status',
        'variance_reason',
        'resolution_notes',
        'resolved_by',
        'resolved_at',
        'action_taken',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function receiptItem()
    {
        return $this->belongsTo(PharmacyReceiptItem::class, 'receipt_item_id', 'id');
    }

    public function goodsReceipt()
    {
        return $this->belongsTo(PharmacyGoodsReceipt::class, 'grn_id', 'id');
    }
}

/**
 * PharmacySupplierPerformance Model
 * 
 * Performance metrics for suppliers
 */
class PharmacySupplierPerformance extends Model
{
    protected $table = 'pharmacy_supplier_performance';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'tenant_id',
        'supplier_id',
        'total_po_count',
        'on_time_delivery_percentage',
        'accuracy_percentage',
        'quality_percentage',
        'rating',
        'late_deliveries',
        'variance_count',
        'quality_issues',
        'avg_lead_time_days',
        'last_calculated_at',
    ];

    protected $casts = [
        'on_time_delivery_percentage' => 'decimal:2',
        'accuracy_percentage' => 'decimal:2',
        'quality_percentage' => 'decimal:2',
        'avg_lead_time_days' => 'decimal:2',
        'last_calculated_at' => 'datetime',
    ];

    public function supplier()
    {
        return $this->belongsTo(PharmacySupplier::class, 'supplier_id', 'id');
    }

    // Scopes
    public function scopeExcellent($query)
    {
        return $query->where('rating', 'excellent');
    }

    public function scopeByRating($query, string $rating)
    {
        return $query->where('rating', $rating);
    }
}
