<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// ============ BATCH DISTRIBUTION ============

class PharmacyBatchDistribution extends Model
{
    use SoftDeletes;

    protected $table = 'pharmacy_batch_distributions';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'tenant_id', 'medicine_id', 'batch_number', 'expiry_date',
        'warehouse_id', 'distribution_type', 'reference_id', 'reference_number',
        'patient_id', 'patient_name', 'patient_mrn',
        'quantity_distributed', 'unit_price', 'distributed_by', 'distributed_at',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'distributed_at' => 'datetime',
        'unit_price' => 'decimal:2',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(MedicineWarehouseModel::class, 'warehouse_id');
    }

    public function recallImpacts(): HasMany
    {
        return $this->hasMany(PharmacyRecallImpact::class, 'distribution_id');
    }

    public function scopeByBatch($query, string $batchNumber)
    {
        return $query->where('batch_number', $batchNumber);
    }

    public function scopeByMedicine($query, string $medicineId)
    {
        return $query->where('medicine_id', $medicineId);
    }

    public function scopeByTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }
}

// ============ RECALL LOG ============

class PharmacyRecallLog extends Model
{
    use SoftDeletes;

    protected $table = 'pharmacy_recall_logs';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'tenant_id', 'recall_number', 'medicine_id', 'batch_number',
        'expiry_date', 'recall_type', 'recall_class', 'recall_reason',
        'recall_detail', 'action_required', 'status',
        'bpom_recall_number', 'bpom_notification_date', 'recall_deadline',
        'initiated_by', 'completed_by', 'initiated_at', 'completed_at', 'completion_notes',
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'bpom_notification_date' => 'date',
        'recall_deadline' => 'date',
        'initiated_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }

    public function impacts(): HasMany
    {
        return $this->hasMany(PharmacyRecallImpact::class, 'recall_id');
    }

    public function initiatedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'initiated_by');
    }

    public function completedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'completed_by');
    }

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['completed', 'cancelled']);
    }

    public function scopeByTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    public function getTotalImpactQuantityAttribute(): int
    {
        return $this->impacts()->sum('quantity_distributed');
    }

    public function getTotalRecoveredQuantityAttribute(): int
    {
        return $this->impacts()->sum('quantity_recovered');
    }
}

// ============ RECALL IMPACT ============

class PharmacyRecallImpact extends Model
{
    protected $table = 'pharmacy_recall_impacts';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'recall_id', 'distribution_id', 'medicine_id', 'batch_number',
        'patient_id', 'patient_name', 'patient_mrn',
        'quantity_distributed', 'quantity_recovered', 'status', 'notes',
        'handled_by', 'handled_at',
    ];

    protected $casts = [
        'handled_at' => 'datetime',
    ];

    public function recall(): BelongsTo
    {
        return $this->belongsTo(PharmacyRecallLog::class, 'recall_id');
    }

    public function distribution(): BelongsTo
    {
        return $this->belongsTo(PharmacyBatchDistribution::class, 'distribution_id');
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }
}

// ============ HIGH ALERT CLASSIFICATION ============

class PharmacyHighAlertClassification extends Model
{
    protected $table = 'pharmacy_high_alert_classifications';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'tenant_id', 'medicine_id', 'alert_level', 'warning_label',
        'storage_requirement', 'dispensing_precaution',
        'double_check_required', 'requires_special_storage',
        'visual_alert_color', 'is_active', 'classified_by', 'updated_by',
    ];

    protected $casts = [
        'double_check_required' => 'boolean',
        'requires_special_storage' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }

    public function classifiedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'classified_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    public function scopeByLevel($query, string $level)
    {
        return $query->where('alert_level', $level);
    }
}

// ============ LASA CLASSIFICATION ============

class PharmacyLASAClassification extends Model
{
    protected $table = 'pharmacy_lasa_classifications';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'tenant_id', 'medicine_a_id', 'medicine_b_id', 'lasa_type',
        'similarity_reason', 'requires_tall_man_lettering',
        'tall_man_lettering_a', 'tall_man_lettering_b',
        'is_active', 'classified_by',
    ];

    protected $casts = [
        'requires_tall_man_lettering' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function medicineA(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_a_id');
    }

    public function medicineB(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_b_id');
    }

    public function classifiedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'classified_by');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    /**
     * Cari LASA pair yang melibatkan obat ini (sebagai A atau B)
     */
    public function scopeInvolvingMedicine($query, string $medicineId)
    {
        return $query->where('medicine_a_id', $medicineId)
            ->orWhere('medicine_b_id', $medicineId);
    }
}
