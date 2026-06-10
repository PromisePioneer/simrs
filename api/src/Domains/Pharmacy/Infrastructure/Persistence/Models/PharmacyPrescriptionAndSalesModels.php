<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Infrastructure\Persistence\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PharmacySafetyAlert extends Model
{
    protected $table = 'pharmacy_safety_alerts';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'medicine_batch_id',
        'alert_type',
        'title',
        'message',
        'severity',
        'days_threshold',
        'stock_threshold',
        'alert_triggered_at',
        'acknowledged_at',
        'acknowledged_by',
        'resolved_at',
        'resolution_notes',
        'status',
    ];

    protected $casts = [
        'alert_triggered_at' => 'datetime',
        'acknowledged_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function medicineBatch(): BelongsTo
    {
        return $this->belongsTo('Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel', 'medicine_batch_id', 'id');
    }
}

class PharmacyPrescription extends Model
{
    protected $table = 'pharmacy_prescriptions';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'prescription_number',
        'patient_id',
        'doctor_id',
        'poli_id',
        'clinic_visit_id',
        'inpatient_admission_id',
        'prescription_date',
        'prescription_type',
        'clinical_notes',
        'special_instructions',
        'refill_count',
        'refill_remaining',
        'status',
        'dispensed_at',
        'cancelled_at',
        'cancellation_reason',
    ];

    protected $casts = [
        'prescription_date' => 'datetime',
        'dispensed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PharmacyPrescriptionItem::class, 'prescription_id', 'id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(PharmacyPrescriptionReview::class, 'prescription_id', 'id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo('App\Models\Patient', 'patient_id', 'id');
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'doctor_id', 'id');
    }
}

class PharmacyPrescriptionItem extends Model
{
    protected $table = 'pharmacy_prescription_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'prescription_id',
        'medicine_id',
        'unit_id',
        'quantity',
        'dosage',
        'frequency',
        'route',
        'usage_instruction',
        'meal_relation',
        'duration_days',
        'is_high_alert',
        'is_lasa',
        'lasa_warning',
        'quantity_dispensed',
        'dispensing_status',
    ];

    protected $casts = [
        'is_high_alert' => 'boolean',
        'is_lasa' => 'boolean',
    ];

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(PharmacyPrescription::class, 'prescription_id', 'id');
    }

    public function medicine(): BelongsTo
    {
        return $this->belongsTo('Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel', 'medicine_id', 'id');
    }
}

class PharmacyPrescriptionReview extends Model
{
    protected $table = 'pharmacy_prescription_reviews';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'prescription_id',
        'pharmacist_id',
        'review_status',
        'review_type',
        'admin_checked',
        'admin_issues',
        'pharma_checked',
        'pharma_issues',
        'is_duplicate_therapy',
        'is_drug_interaction',
        'is_contraindication',
        'clinical_checked',
        'clinical_issues',
        'is_dose_appropriate',
        'is_frequency_appropriate',
        'is_duration_appropriate',
        'review_notes',
        'recommendations',
        'reviewed_at',
    ];

    protected $casts = [
        'admin_checked' => 'boolean',
        'pharma_checked' => 'boolean',
        'is_duplicate_therapy' => 'boolean',
        'is_drug_interaction' => 'boolean',
        'is_contraindication' => 'boolean',
        'clinical_checked' => 'boolean',
        'is_dose_appropriate' => 'boolean',
        'is_frequency_appropriate' => 'boolean',
        'is_duration_appropriate' => 'boolean',
        'reviewed_at' => 'datetime',
    ];

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(PharmacyPrescription::class, 'prescription_id', 'id');
    }

    public function pharmacist(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'pharmacist_id', 'id');
    }
}

class PharmacySale extends Model
{
    protected $table = 'pharmacy_sales';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'sales_number',
        'patient_id',
        'prescription_id',
        'warehouse_id',
        'pharmacist_id',
        'sales_date',
        'sales_type',
        'payment_status',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'total_amount',
        'notes',
        'status',
    ];

    protected $casts = [
        'sales_date' => 'datetime',
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PharmacySaleItem::class, 'sales_id', 'id');
    }

    public function prescription(): BelongsTo
    {
        return $this->belongsTo(PharmacyPrescription::class, 'prescription_id', 'id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo('App\Models\Patient', 'patient_id', 'id');
    }

    public function pharmacist(): BelongsTo
    {
        return $this->belongsTo('App\Models\User', 'pharmacist_id', 'id');
    }
}

class PharmacySaleItem extends Model
{
    protected $table = 'pharmacy_sales_items';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'sales_id',
        'prescription_item_id',
        'medicine_batch_id',
        'unit_id',
        'quantity_sold',
        'unit_price',
        'subtotal',
        'discount_per_item',
        'final_price',
        'batch_number',
        'expiry_date',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'discount_per_item' => 'decimal:2',
        'final_price' => 'decimal:2',
        'expiry_date' => 'date',
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(PharmacySale::class, 'sales_id', 'id');
    }

    public function medicineBatch(): BelongsTo
    {
        return $this->belongsTo('Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel', 'medicine_batch_id', 'id');
    }
}

class PharmacyPatientReturn extends Model
{
    protected $table = 'pharmacy_patient_returns';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'return_number',
        'sales_id',
        'patient_id',
        'return_date',
        'reason',
        'reason_description',
        'return_amount',
        'is_refunded',
        'refunded_at',
        'status',
        'notes',
        'processed_by',
    ];

    protected $casts = [
        'return_date' => 'datetime',
        'refunded_at' => 'datetime',
        'is_refunded' => 'boolean',
        'return_amount' => 'decimal:2',
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(PharmacySale::class, 'sales_id', 'id');
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo('App\Models\Patient', 'patient_id', 'id');
    }
}

class PharmacyCompoundedMedicine extends Model
{
    protected $table = 'pharmacy_compounded_medicines';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'compound_code',
        'name',
        'description',
        'form',
        'unit_price',
        'packing_cost',
        'production_cost',
        'status',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'packing_cost' => 'decimal:2',
        'production_cost' => 'decimal:2',
    ];

    public function components(): HasMany
    {
        return $this->hasMany(PharmacyCompoundComponent::class, 'compounded_medicine_id', 'id');
    }
}

class PharmacyCompoundComponent extends Model
{
    protected $table = 'pharmacy_compound_components';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'compounded_medicine_id',
        'medicine_id',
        'quantity',
        'unit_id',
        'unit_price',
        'subtotal',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function compoundedMedicine(): BelongsTo
    {
        return $this->belongsTo(PharmacyCompoundedMedicine::class, 'compounded_medicine_id', 'id');
    }
}

// Alias models for compatibility
class MedicineBatchStockModel extends Model
{
    protected $table = 'medicine_batch_stocks';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'batch_id',
        'warehouse_id',
        'rack_id',
        'quantity',
        'status',
    ];

    public function medicineBatch(): BelongsTo
    {
        return $this->belongsTo('Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel', 'batch_id', 'id');
    }
}

class MedicineBatchModel extends Model
{
    protected $table = 'medicine_batches';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'medicine_id',
        'batch_number',
        'sequence',
        'is_auto_batch',
        'expired_date',
        'selling_price',
    ];

    protected $casts = [
        'expired_date' => 'date',
        'selling_price' => 'decimal:2',
    ];

    public function medicine(): BelongsTo
    {
        return $this->belongsTo('Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel', 'medicine_id', 'id');
    }
}

class MedicineModel extends Model
{
    protected $table = 'medicines';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'tenant_id',
        'sku',
        'sequence',
        'name',
        'base_unit',
        'type',
        'must_has_receipt',
        'is_for_sell',
        'minimum_stock_amount',
        'category_id',
        'reference_purchase_price',
        'is_high_alert',
        'is_lasa',
        'selling_price',
        'strength',
    ];

    protected $casts = [
        'must_has_receipt' => 'boolean',
        'is_for_sell' => 'boolean',
        'is_high_alert' => 'boolean',
        'is_lasa' => 'boolean',
        'reference_purchase_price' => 'decimal:2',
        'selling_price' => 'decimal:2',
    ];
}
