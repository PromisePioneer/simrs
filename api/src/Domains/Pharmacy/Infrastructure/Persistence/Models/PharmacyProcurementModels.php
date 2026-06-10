<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PharmacySupplier extends Model
{
    protected $table = 'pharmacy_suppliers';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'name',
        'code',
        'contact_person',
        'phone',
        'email',
        'address',
        'city',
        'province',
        'postal_code',
        'bank_name',
        'bank_account',
        'bank_account_name',
        'discount_percentage',
        'tax_percentage',
        'status',
    ];

    protected $casts = [
        'discount_percentage' => 'decimal:2',
        'tax_percentage' => 'decimal:2',
    ];

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PharmacyPurchaseOrder::class, 'supplier_id', 'id');
    }

    public function purchaseReturns(): HasMany
    {
        return $this->hasMany(PharmacyPurchaseReturn::class, 'supplier_id', 'id');
    }
}

class PharmacyPurchaseOrder extends Model
{
    protected $table = 'pharmacy_purchase_orders';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'po_number',
        'supplier_id',
        'warehouse_id',
        'po_date',
        'expected_delivery_date',
        'status',
        'total_amount',
        'discount_amount',
        'tax_amount',
        'grand_total',
        'notes',
        'created_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'po_date' => 'datetime',
        'expected_delivery_date' => 'datetime',
        'approved_at' => 'datetime',
        'total_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'grand_total' => 'decimal:2',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(PharmacySupplier::class, 'supplier_id', 'id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PharmacyPurchaseOrderItem::class, 'purchase_order_id', 'id');
    }

    public function goodsReceipts(): HasMany
    {
        return $this->hasMany(PharmacyGoodsReceiptNote::class, 'purchase_order_id', 'id');
    }
}

class PharmacyPurchaseOrderItem extends Model
{
    protected $table = 'pharmacy_purchase_order_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'purchase_order_id',
        'medicine_id',
        'unit_id',
        'quantity',
        'unit_price',
        'quantity_received',
        'subtotal',
        'notes',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PharmacyPurchaseOrder::class, 'purchase_order_id', 'id');
    }
}

class PharmacyGoodsReceiptNote extends Model
{
    protected $table = 'pharmacy_goods_receipt_notes';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'grn_number',
        'purchase_order_id',
        'receipt_date',
        'status',
        'notes',
        'received_by',
    ];

    protected $casts = [
        'receipt_date' => 'datetime',
    ];

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PharmacyPurchaseOrder::class, 'purchase_order_id', 'id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PharmacyGoodsReceiptItem::class, 'goods_receipt_note_id', 'id');
    }
}

class PharmacyGoodsReceiptItem extends Model
{
    protected $table = 'pharmacy_goods_receipt_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'goods_receipt_note_id',
        'purchase_order_item_id',
        'medicine_batch_id',
        'quantity_received',
        'batch_number',
        'expiry_date',
        'manufacture_date',
        'unit_price',
        'notes',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'manufacture_date' => 'date',
        'unit_price' => 'decimal:2',
    ];

    public function goodsReceiptNote(): BelongsTo
    {
        return $this->belongsTo(PharmacyGoodsReceiptNote::class, 'goods_receipt_note_id', 'id');
    }
}

class PharmacyPurchaseReturn extends Model
{
    protected $table = 'pharmacy_purchase_returns';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'return_number',
        'purchase_order_id',
        'supplier_id',
        'return_date',
        'reason',
        'reason_description',
        'total_return_amount',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'return_date' => 'datetime',
        'total_return_amount' => 'decimal:2',
    ];

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PharmacyPurchaseOrder::class, 'purchase_order_id', 'id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(PharmacySupplier::class, 'supplier_id', 'id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PharmacyPurchaseReturnItem::class, 'purchase_return_id', 'id');
    }
}

class PharmacyPurchaseReturnItem extends Model
{
    protected $table = 'pharmacy_purchase_return_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'purchase_return_id',
        'medicine_batch_id',
        'quantity_returned',
        'unit_price',
        'subtotal',
        'notes',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function purchaseReturn(): BelongsTo
    {
        return $this->belongsTo(PharmacyPurchaseReturn::class, 'purchase_return_id', 'id');
    }
}
