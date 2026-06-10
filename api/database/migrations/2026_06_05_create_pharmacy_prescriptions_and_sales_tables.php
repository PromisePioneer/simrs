<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel Safety Alerts & Expired Date Reminders
        Schema::create('pharmacy_safety_alerts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('medicine_batch_id')->constrained('medicine_batches')->cascadeOnDelete();
            $table->enum('alert_type', ['expired_soon', 'expired', 'stock_low', 'stock_empty', 'high_alert', 'lasa'])->index();
            $table->string('title');
            $table->text('message');
            $table->enum('severity', ['info', 'warning', 'critical', 'danger'])->default('warning');
            $table->integer('days_threshold')->nullable();
            $table->integer('stock_threshold')->nullable();
            $table->datetime('alert_triggered_at');
            $table->datetime('acknowledged_at')->nullable();
            $table->uuid('acknowledged_by')->nullable();
            $table->foreign('acknowledged_by')->references('id')->on('users')->nullOnDelete();
            $table->datetime('resolved_at')->nullable();
            $table->text('resolution_notes')->nullable();
            $table->enum('status', ['active', 'acknowledged', 'resolved', 'dismissed'])->default('active')->index();
            $table->timestamps();
        });

        // Tabel E-Resep / Prescription
        Schema::create('pharmacy_prescriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('prescription_number')->unique();
            $table->uuid('patient_id');
            $table->foreign('patient_id')->references('id')->on('patients')->cascadeOnDelete();
            $table->uuid('doctor_id');
            $table->foreign('doctor_id')->references('id')->on('users')->cascadeOnDelete();
            $table->uuid('poli_id')->nullable();
            $table->foreignUuid('clinic_visit_id')->nullable();
            $table->uuid('inpatient_admission_id')->nullable();
            $table->datetime('prescription_date');
            $table->enum('prescription_type', ['outpatient', 'inpatient', 'emergency'])->default('outpatient');
            $table->text('clinical_notes')->nullable();
            $table->text('special_instructions')->nullable();
            $table->integer('refill_count')->default(0);
            $table->integer('refill_remaining')->default(0);
            $table->enum('status', ['pending', 'dispensed', 'partially_dispensed', 'cancelled', 'expired'])->default('pending')->index();
            $table->datetime('dispensed_at')->nullable();
            $table->datetime('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
        });

        // Tabel Prescription Items (Detail Resep)
        Schema::create('pharmacy_prescription_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('prescription_id')->constrained('pharmacy_prescriptions')->cascadeOnDelete();
            $table->foreignUuid('medicine_id')->constrained('medicines')->cascadeOnDelete();
            $table->bigInteger('unit_id')->unsigned()->nullable();
            $table->integer('quantity');
            $table->string('dosage')->nullable();
            $table->string('frequency')->nullable();
            $table->string('route')->nullable();
            $table->text('usage_instruction')->nullable();
            $table->enum('meal_relation', ['before_meal', 'after_meal', 'with_meal', 'no_relation'])->nullable();
            $table->integer('duration_days')->nullable();
            $table->boolean('is_high_alert')->default(false);
            $table->boolean('is_lasa')->default(false);
            $table->text('lasa_warning')->nullable();
            $table->integer('quantity_dispensed')->default(0);
            $table->enum('dispensing_status', ['pending', 'partial', 'completed', 'not_available'])->default('pending');
            $table->timestamps();
        });

        // Tabel Review Resep (Telaah Resep Elektronik)
        Schema::create('pharmacy_prescription_reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('prescription_id')->constrained('pharmacy_prescriptions')->cascadeOnDelete();
            $table->uuid('pharmacist_id');
            $table->foreign('pharmacist_id')->references('id')->on('users')->cascadeOnDelete();
            $table->enum('review_status', ['pending', 'approved', 'rejected', 'needs_clarification'])->default('pending')->index();
            $table->enum('review_type', ['administrative', 'pharmaceutical', 'clinical'])->default('administrative');
            
            // Administrative Review
            $table->boolean('admin_checked')->default(false);
            $table->text('admin_issues')->nullable();
            
            // Pharmaceutical Review
            $table->boolean('pharma_checked')->default(false);
            $table->text('pharma_issues')->nullable();
            $table->boolean('is_duplicate_therapy')->default(false);
            $table->boolean('is_drug_interaction')->default(false);
            $table->boolean('is_contraindication')->default(false);
            
            // Clinical Review
            $table->boolean('clinical_checked')->default(false);
            $table->text('clinical_issues')->nullable();
            $table->boolean('is_dose_appropriate')->default(true);
            $table->boolean('is_frequency_appropriate')->default(true);
            $table->boolean('is_duration_appropriate')->default(true);
            
            // Overall Review
            $table->text('review_notes')->nullable();
            $table->text('recommendations')->nullable();
            $table->datetime('reviewed_at')->nullable();
            $table->timestamps();
        });

        // Tabel Penjualan Farmasi (Sales/Dispensing)
        Schema::create('pharmacy_sales', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('sales_number')->unique();
            $table->uuid('patient_id')->nullable();
            $table->foreign('patient_id')->references('id')->on('patients')->nullOnDelete();
            $table->foreignUuid('prescription_id')->nullable()->constrained('pharmacy_prescriptions')->nullOnDelete();
            $table->foreignUuid('warehouse_id')->constrained('medicine_warehouses')->cascadeOnDelete();
            $table->uuid('pharmacist_id');
            $table->foreign('pharmacist_id')->references('id')->on('users')->cascadeOnDelete();
            $table->datetime('sales_date');
            $table->enum('sales_type', ['inpatient', 'outpatient', 'emergency', 'otc'])->default('outpatient')->index();
            $table->enum('payment_status', ['pending', 'paid', 'partial', 'credit'])->default('pending');
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'completed', 'cancelled', 'returned'])->default('draft')->index();
            $table->timestamps();
        });

        // Tabel Sales Items (Detail Penjualan)
        Schema::create('pharmacy_sales_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sales_id')->constrained('pharmacy_sales')->cascadeOnDelete();
            $table->foreignUuid('prescription_item_id')->nullable()->constrained('pharmacy_prescription_items')->nullOnDelete();
            $table->foreignUuid('medicine_batch_id')->constrained('medicine_batches')->cascadeOnDelete();
            $table->bigInteger('unit_id')->unsigned()->nullable();
            $table->integer('quantity_sold');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->decimal('discount_per_item', 15, 2)->default(0);
            $table->decimal('final_price', 15, 2);
            $table->string('batch_number');
            $table->date('expiry_date');
            $table->timestamps();
        });

        // Tabel Retur Obat Pasien (Patient Medicine Return)
        Schema::create('pharmacy_patient_returns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('return_number')->unique();
            $table->foreignUuid('sales_id')->constrained('pharmacy_sales')->cascadeOnDelete();
            $table->uuid('patient_id');
            $table->foreign('patient_id')->references('id')->on('patients')->cascadeOnDelete();
            $table->datetime('return_date');
            $table->enum('reason', ['not_used', 'wrong_medicine', 'side_effect', 'expired_received', 'damaged', 'other'])->default('other');
            $table->text('reason_description')->nullable();
            $table->decimal('return_amount', 15, 2)->default(0);
            $table->boolean('is_refunded')->default(false);
            $table->datetime('refunded_at')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'processed'])->default('pending');
            $table->text('notes')->nullable();
            $table->uuid('processed_by');
            $table->foreign('processed_by')->references('id')->on('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // Tabel Obat Racikan (Compounded Medicine)
        Schema::create('pharmacy_compounded_medicines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('compound_code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('form', ['puyer', 'kaplet', 'sirup', 'salep', 'lainnya'])->default('puyer');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('packing_cost', 15, 2)->default(0);
            $table->decimal('production_cost', 15, 2)->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // Tabel Komponen Obat Racikan
        Schema::create('pharmacy_compound_components', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('compounded_medicine_id')->constrained('pharmacy_compounded_medicines')->cascadeOnDelete();
            $table->foreignUuid('medicine_id')->constrained('medicines')->cascadeOnDelete();
            $table->integer('quantity');
            $table->bigInteger('unit_id')->unsigned()->nullable();
            $table->decimal('unit_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_compound_components');
        Schema::dropIfExists('pharmacy_compounded_medicines');
        Schema::dropIfExists('pharmacy_patient_returns');
        Schema::dropIfExists('pharmacy_sales_items');
        Schema::dropIfExists('pharmacy_sales');
        Schema::dropIfExists('pharmacy_prescription_reviews');
        Schema::dropIfExists('pharmacy_prescription_items');
        Schema::dropIfExists('pharmacy_prescriptions');
        Schema::dropIfExists('pharmacy_safety_alerts');
    }
};
