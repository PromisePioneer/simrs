<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// ============ STOCK TRANSFER MODELS ============

class PharmacyStockTransfer extends Model
{
    protected $table = 'pharmacy_stock_transfers';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'transfer_number',
        'source_warehouse_id',
        'destination_warehouse_id',
        'transfer_date',
        'received_date',
        'status',
        'notes',
        'created_by',
        'approved_by',
        'received_by',
    ];

    protected $casts = [
        'transfer_date' => 'datetime',
        'received_date' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PharmacyStockTransferItem::class, 'transfer_id', 'id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'created_by', 'id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'approved_by', 'id');
    }

    public function receivedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'received_by', 'id');
    }
}

class PharmacyStockTransferItem extends Model
{
    protected $table = 'pharmacy_stock_transfer_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'transfer_id',
        'medicine_batch_id',
        'quantity_requested',
        'quantity_sent',
        'quantity_received',
        'notes',
    ];

    public function transfer(): BelongsTo
    {
        return $this->belongsTo(PharmacyStockTransfer::class, 'transfer_id', 'id');
    }

    public function medicineBatch(): BelongsTo
    {
        return $this->belongsTo(MedicineBatchModel::class, 'medicine_batch_id', 'id');
    }
}

// ============ STOCK OPNAME MODELS ============

class PharmacyStockOpname extends Model
{
    protected $table = 'pharmacy_stock_opnames';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'opname_number',
        'warehouse_id',
        'opname_date',
        'status',
        'started_by',
        'finalized_by',
        'started_at',
        'finalized_at',
        'total_variance_amount',
        'notes',
    ];

    protected $casts = [
        'opname_date' => 'date',
        'started_at' => 'datetime',
        'finalized_at' => 'datetime',
        'total_variance_amount' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PharmacyStockOpnameItem::class, 'opname_id', 'id');
    }

    public function startedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'started_by', 'id');
    }

    public function finalizedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'finalized_by', 'id');
    }
}

class PharmacyStockOpnameItem extends Model
{
    protected $table = 'pharmacy_stock_opname_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'opname_id',
        'medicine_batch_id',
        'system_quantity',
        'physical_quantity',
        'variance',
        'variance_amount',
        'variance_reason',
        'notes',
    ];

    protected $casts = [
        'variance_amount' => 'decimal:2',
    ];

    public function opname(): BelongsTo
    {
        return $this->belongsTo(PharmacyStockOpname::class, 'opname_id', 'id');
    }

    public function medicineBatch(): BelongsTo
    {
        return $this->belongsTo(MedicineBatchModel::class, 'medicine_batch_id', 'id');
    }
}

// ============ ALERT HISTORY MODELS ============

class PharmacyAlertHistory extends Model
{
    protected $table = 'pharmacy_alert_histories';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'alert_id',
        'action',
        'action_notes',
        'action_by',
        'action_at',
        'status_before',
        'status_after',
    ];

    protected $casts = [
        'action_at' => 'datetime',
    ];

    public function alert(): BelongsTo
    {
        return $this->belongsTo(PharmacySafetyAlert::class, 'alert_id', 'id');
    }

    public function actionBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'action_by', 'id');
    }
}

class PharmacyAlertEscalation extends Model
{
    protected $table = 'pharmacy_alert_escalations';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'alert_id',
        'escalation_level',
        'escalated_at',
        'escalated_by',
        'recipients',
        'escalation_message',
        'is_resolved',
        'resolved_at',
    ];

    protected $casts = [
        'escalated_at' => 'datetime',
        'resolved_at' => 'datetime',
        'is_resolved' => 'boolean',
        'recipients' => 'json',
    ];

    public function alert(): BelongsTo
    {
        return $this->belongsTo(PharmacySafetyAlert::class, 'alert_id', 'id');
    }

    public function escalatedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'escalated_by', 'id');
    }
}

// ============ INSTRUCTION TEMPLATE MODELS ============

class PharmacyInstructionTemplate extends Model
{
    protected $table = 'pharmacy_instruction_templates';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'name',
        'description',
        'template_format',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function rules(): HasMany
    {
        return $this->hasMany(PharmacyInstructionRule::class, 'template_id', 'id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'created_by', 'id');
    }
}

class PharmacyInstructionRule extends Model
{
    protected $table = 'pharmacy_instruction_rules';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'template_id',
        'medicine_id',
        'age_min',
        'age_max',
        'frequency',
        'dosage',
        'duration',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(PharmacyInstructionTemplate::class, 'template_id', 'id');
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id', 'id');
    }
}

// ============ KFA MAPPING MODELS ============

class PharmacyKFAMapping extends Model
{
    protected $table = 'pharmacy_kfa_mapping';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'kfa_code',
        'kfa_name',
        'kfa_unit',
        'kfa_category',
        'last_sync_date',
        'is_valid',
        'mapping_notes',
    ];

    protected $casts = [
        'last_sync_date' => 'datetime',
        'is_valid' => 'boolean',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id', 'id');
    }
}

// ============ REPORTING MODELS ============

class PharmacyUsageReport extends Model
{
    protected $table = 'pharmacy_usage_reports';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'report_date',
        'report_period',
        'total_units_sold',
        'total_revenue',
        'total_cost',
        'total_profit',
        'profit_margin_percentage',
        'movement_category',
        'stock_on_hand',
        'days_stock_on_hand',
        'analysis_notes',
    ];

    protected $casts = [
        'report_date' => 'date',
        'total_revenue' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'total_profit' => 'decimal:2',
        'profit_margin_percentage' => 'decimal:2',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id', 'id');
    }
}

class PharmacyNarcoticsReport extends Model
{
    protected $table = 'pharmacy_narcotics_reports';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'report_date',
        'report_period',
        'opening_stock',
        'quantity_received',
        'quantity_dispensed',
        'quantity_returned',
        'quantity_destroyed',
        'closing_stock',
        'destruction_notes',
        'verified_by',
        'verified_at',
        'submitted_to_dinkes',
        'submitted_at',
    ];

    protected $casts = [
        'report_date' => 'date',
        'verified_at' => 'datetime',
        'submitted_at' => 'datetime',
        'submitted_to_dinkes' => 'boolean',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id', 'id');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'verified_by', 'id');
    }
}

class PharmacyFinancialReport extends Model
{
    protected $table = 'pharmacy_financial_reports';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'report_date',
        'report_period',
        'total_sales',
        'total_discount',
        'total_tax',
        'net_sales',
        'total_cost_of_goods_sold',
        'gross_profit',
        'gross_profit_percentage',
        'operating_expenses',
        'net_profit',
        'net_profit_percentage',
        'total_transactions',
        'total_items_sold',
        'average_transaction_value',
        'notes',
    ];

    protected $casts = [
        'report_date' => 'date',
        'total_sales' => 'decimal:2',
        'total_discount' => 'decimal:2',
        'total_tax' => 'decimal:2',
        'net_sales' => 'decimal:2',
        'total_cost_of_goods_sold' => 'decimal:2',
        'gross_profit' => 'decimal:2',
        'gross_profit_percentage' => 'decimal:2',
        'operating_expenses' => 'decimal:2',
        'net_profit' => 'decimal:2',
        'net_profit_percentage' => 'decimal:2',
        'average_transaction_value' => 'decimal:2',
    ];
}

class PharmacyDefectaReport extends Model
{
    protected $table = 'pharmacy_defecta_reports';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'report_date',
        'defecta_reason',
        'current_stock',
        'minimum_stock',
        'reorder_quantity',
        'estimated_cost',
        'days_until_stockout',
        'is_urgent',
        'is_ordered',
        'ordered_by',
        'ordered_at',
        'po_id',
        'notes',
    ];

    protected $casts = [
        'report_date' => 'date',
        'estimated_cost' => 'decimal:2',
        'is_urgent' => 'boolean',
        'is_ordered' => 'boolean',
        'ordered_at' => 'datetime',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id', 'id');
    }

    public function orderedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'ordered_by', 'id');
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PharmacyPurchaseOrder::class, 'po_id', 'id');
    }
}

class PharmacyGeneralLedgerStock extends Model
{
    protected $table = 'pharmacy_general_ledger_stock';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'medicine_batch_id',
        'transaction_date',
        'transaction_type',
        'reference_type',
        'reference_id',
        'quantity_in',
        'quantity_out',
        'balance',
        'unit_cost',
        'transaction_amount',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'transaction_date' => 'date',
        'unit_cost' => 'decimal:2',
        'transaction_amount' => 'decimal:2',
    ];

    public function medicineBatch(): BelongsTo
    {
        return $this->belongsTo(MedicineBatchModel::class, 'medicine_batch_id', 'id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'created_by', 'id');
    }
}

class PharmacyInventorySummary extends Model
{
    protected $table = 'pharmacy_inventory_summary';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'warehouse_id',
        'medicine_id',
        'total_quantity',
        'total_value',
        'average_unit_cost',
        'batch_count',
        'first_batch_received',
        'latest_batch_received',
        'earliest_expiry_date',
        'items_expiring_soon',
        'items_expired',
        'last_updated_at',
    ];

    protected $casts = [
        'total_value' => 'decimal:2',
        'average_unit_cost' => 'decimal:2',
        'first_batch_received' => 'date',
        'latest_batch_received' => 'date',
        'earliest_expiry_date' => 'date',
        'last_updated_at' => 'datetime',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id', 'id');
    }
}

class PharmacyBatchRecallHistory extends Model
{
    protected $table = 'pharmacy_batch_recall_history';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'medicine_batch_id',
        'recall_reason',
        'recall_date',
        'recall_description',
        'recalled_by',
        'recalled_at',
        'initial_quantity_received',
        'quantity_distributed',
        'quantity_returned',
        'quantity_destroyed',
        'quantity_unaccounted',
        'recall_status',
        'verified_by',
        'verified_at',
        'recall_summary',
    ];

    protected $casts = [
        'recall_date' => 'date',
        'recalled_at' => 'datetime',
        'verified_at' => 'datetime',
    ];

    public function medicineBatch(): BelongsTo
    {
        return $this->belongsTo(MedicineBatchModel::class, 'medicine_batch_id', 'id');
    }

    public function recalledBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'recalled_by', 'id');
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'verified_by', 'id');
    }
}

class PharmacyExternalSyncLog extends Model
{
    protected $table = 'pharmacy_external_sync_logs';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'external_system',
        'sync_type',
        'request_data',
        'response_data',
        'sync_status',
        'error_message',
        'records_synced',
        'records_failed',
        'initiated_by',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'request_data' => 'json',
        'response_data' => 'json',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function initiatedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'initiated_by', 'id');
    }
}

class PharmacySatuSehatMapping extends Model
{
    protected $table = 'pharmacy_satusehat_mappings';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'satusehat_code',
        'satusehat_name',
        'satusehat_unit',
        'satusehat_form',
        'satusehat_strength',
        'is_narcotics',
        'is_psychotropics',
        'is_precursor',
        'last_validated_at',
        'is_valid',
        'validation_errors',
    ];

    protected $casts = [
        'is_narcotics' => 'boolean',
        'is_psychotropics' => 'boolean',
        'is_precursor' => 'boolean',
        'last_validated_at' => 'datetime',
        'is_valid' => 'boolean',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id', 'id');
    }
}

class PharmacyGovernmentReport extends Model
{
    protected $table = 'pharmacy_government_reports';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'report_type',
        'reporting_period',
        'recipient_agency',
        'report_format',
        'report_file_path',
        'submission_status',
        'submission_details',
        'prepared_by',
        'prepared_at',
        'submitted_by',
        'submitted_at',
        'acknowledged_by',
        'acknowledged_at',
        'submission_notes',
    ];

    protected $casts = [
        'submission_details' => 'json',
        'prepared_at' => 'datetime',
        'submitted_at' => 'datetime',
        'acknowledged_at' => 'datetime',
    ];

    public function preparedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'prepared_by', 'id');
    }

    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'submitted_by', 'id');
    }

    public function acknowledgedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'acknowledged_by', 'id');
    }
}
