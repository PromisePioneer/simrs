<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

// ============ E-PRESCRIPTION ============

class PharmacyEPrescription extends Model
{
    use SoftDeletes;

    protected $table = 'pharmacy_eprescriptions';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'tenant_id', 'prescription_number', 'prescription_source',
        'visit_id', 'admission_id', 'visit_reference',
        'patient_id', 'patient_name', 'patient_mrn',
        'doctor_id', 'doctor_name', 'doctor_sip',
        'diagnosis_code', 'diagnosis_name', 'status', 'priority',
        'prescribed_at', 'reviewed_by', 'reviewed_at',
        'verified_by', 'verified_at', 'dispensed_by', 'dispensed_at',
        'doctor_notes', 'pharmacist_notes', 'hold_reason', 'created_by',
    ];

    protected $casts = [
        'prescribed_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'verified_at' => 'datetime',
        'dispensed_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PharmacyEPrescriptionItem::class, 'prescription_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(PharmacyPrescriptionReview::class, 'prescription_id');
    }

    public function compoundingBatches(): HasMany
    {
        return $this->hasMany(PharmacyCompoundingBatch::class, 'prescription_id');
    }

    public function scopeByTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function isFullyReviewed(): bool
    {
        $reviewTypes = $this->reviews->pluck('review_type')->toArray();
        return in_array('administrative', $reviewTypes)
            && in_array('pharmaceutical', $reviewTypes)
            && in_array('clinical', $reviewTypes);
    }
}

class PharmacyEPrescriptionItem extends Model
{
    protected $table = 'pharmacy_eprescription_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'prescription_id', 'medicine_id', 'medicine_name',
        'dose', 'dose_unit', 'frequency_per_day', 'duration_days',
        'total_quantity', 'route_of_administration', 'dosage_instruction',
        'is_compounding', 'compounding_formula_id',
        'dispensing_status', 'substituted_medicine_id', 'substitution_reason', 'notes',
    ];

    protected $casts = [
        'dose' => 'decimal:3',
        'is_compounding' => 'boolean',
    ];

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(PharmacyEPrescription::class, 'prescription_id');
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }

    public function compoundingFormula(): BelongsTo
    {
        return $this->belongsTo(PharmacyCompoundingFormula::class, 'compounding_formula_id');
    }
}

// ============ PRESCRIPTION REVIEW ============

class PharmacyPrescriptionReview extends Model
{
    protected $table = 'pharmacy_prescription_reviews';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'prescription_id', 'review_type', 'result',
        'checklist_results', 'drug_interactions', 'contraindications',
        'allergy_alerts', 'duplicate_therapy', 'review_notes',
        'reviewed_by', 'reviewed_at',
    ];

    protected $casts = [
        'checklist_results' => 'array',
        'drug_interactions' => 'array',
        'contraindications' => 'array',
        'allergy_alerts' => 'array',
        'duplicate_therapy' => 'boolean',
        'reviewed_at' => 'datetime',
    ];

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(PharmacyEPrescription::class, 'prescription_id');
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'reviewed_by');
    }

    public function hasIssues(): bool
    {
        return !empty($this->drug_interactions)
            || !empty($this->contraindications)
            || !empty($this->allergy_alerts)
            || $this->duplicate_therapy;
    }
}

// ============ COMPOUNDING FORMULA ============

class PharmacyCompoundingFormula extends Model
{
    use SoftDeletes;

    protected $table = 'pharmacy_compounding_formulas';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'tenant_id', 'formula_name', 'formula_code', 'formula_type',
        'yield_quantity', 'yield_unit',
        'compounding_fee', 'packaging_fee',
        'is_active', 'instructions', 'notes', 'created_by',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'compounding_fee' => 'decimal:2',
        'packaging_fee' => 'decimal:2',
    ];

    public function components(): HasMany
    {
        return $this->hasMany(PharmacyCompoundingFormulaComponent::class, 'formula_id')
            ->orderBy('sort_order');
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
     * Hitung total biaya komponen untuk sejumlah yield
     */
    public function calculateComponentCost(int $quantity): float
    {
        return $this->components->sum(function ($component) use ($quantity) {
            return $component->quantity_per_yield * $quantity * ($component->medicine?->selling_price ?? 0);
        });
    }

    public function getTotalFeeAttribute(): float
    {
        return (float)$this->compounding_fee + (float)$this->packaging_fee;
    }
}

class PharmacyCompoundingFormulaComponent extends Model
{
    protected $table = 'pharmacy_compounding_formula_components';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'formula_id', 'medicine_id', 'medicine_name',
        'quantity_per_yield', 'unit', 'sort_order', 'notes',
    ];

    protected $casts = [
        'quantity_per_yield' => 'decimal:4',
    ];

    public function formula(): BelongsTo
    {
        return $this->belongsTo(PharmacyCompoundingFormula::class, 'formula_id');
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }
}

// ============ COMPOUNDING BATCH ============

class PharmacyCompoundingBatch extends Model
{
    protected $table = 'pharmacy_compounding_batches';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'tenant_id', 'prescription_id', 'prescription_item_id',
        'formula_id', 'quantity_to_make', 'batch_reference', 'status',
        'component_cost', 'compounding_fee', 'packaging_fee', 'total_cost',
        'prepared_by', 'verified_by', 'started_at', 'completed_at', 'notes',
    ];

    protected $casts = [
        'component_cost' => 'decimal:2',
        'compounding_fee' => 'decimal:2',
        'packaging_fee' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(PharmacyEPrescription::class, 'prescription_id');
    }

    public function formula(): BelongsTo
    {
        return $this->belongsTo(PharmacyCompoundingFormula::class, 'formula_id');
    }

    public function components(): HasMany
    {
        return $this->hasMany(PharmacyCompoundingBatchComponent::class, 'batch_id');
    }
}

class PharmacyCompoundingBatchComponent extends Model
{
    protected $table = 'pharmacy_compounding_batch_components';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'batch_id', 'medicine_id', 'batch_number',
        'quantity_used', 'unit', 'unit_cost', 'total_cost',
    ];

    protected $casts = [
        'quantity_used' => 'decimal:4',
        'unit_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    public function batch(): BelongsTo
    {
        return $this->belongsTo(PharmacyCompoundingBatch::class, 'batch_id');
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo(MedicineModel::class, 'medicine_id');
    }
}

// ============ LABEL TEMPLATE ============

class PharmacyLabelTemplate extends Model
{
    protected $table = 'pharmacy_label_templates';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id', 'tenant_id', 'template_name', 'template_type',
        'header_text', 'body_template', 'footer_text', 'warning_text',
        'paper_size', 'font_size', 'show_barcode', 'show_qr_code', 'show_logo',
        'is_default', 'is_active', 'created_by',
    ];

    protected $casts = [
        'show_barcode' => 'boolean',
        'show_qr_code' => 'boolean',
        'show_logo' => 'boolean',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByTenant($query, string $tenantId)
    {
        return $query->where('tenant_id', $tenantId);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Render template dengan data aktual
     */
    public function render(array $data): string
    {
        $template = $this->body_template;
        foreach ($data as $key => $value) {
            $template = str_replace('{{' . $key . '}}', $value ?? '', $template);
        }
        return $template;
    }
}
