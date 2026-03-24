<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ─── Tagihan Rawat Jalan ──────────────────────────────────────────────
        Schema::create('outpatient_bills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('outpatient_visit_id')->constrained('outpatient_visits')->cascadeOnDelete();
            $table->foreignUuid('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignUuid('payment_method_id')->nullable()->constrained('payment_methods')->nullOnDelete();

            $table->string('bill_number')->unique();
            $table->enum('status', ['draft', 'issued', 'paid', 'cancelled'])->default('draft')->index();

            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);

            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'patient_id']);
            $table->unique('outpatient_visit_id'); // 1 visit = 1 bill
        });

        // ─── Tagihan Rawat Inap ───────────────────────────────────────────────
        Schema::create('inpatient_bills', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('inpatient_admission_id')->constrained('inpatient_admissions')->cascadeOnDelete();
            $table->foreignUuid('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignUuid('payment_method_id')->nullable()->constrained('payment_methods')->nullOnDelete();

            $table->string('bill_number')->unique();
            $table->enum('status', ['draft', 'issued', 'paid', 'cancelled'])->default('draft')->index();

            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('tax', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);

            $table->timestamp('paid_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'patient_id']);
            $table->unique('inpatient_admission_id'); // 1 admission = 1 bill
        });

        // ─── Line Items (shared rawat jalan & rawat inap) ─────────────────────
        Schema::create('bill_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();

            // Salah satu dari dua ini yang terisi
            $table->foreignUuid('bill_id')->nullable()->constrained('outpatient_bills')->cascadeOnDelete();
            $table->foreignUuid('inpatient_bill_id')->nullable()->constrained('inpatient_bills')->cascadeOnDelete();

            $table->foreignUuid('medicine_batch_id')->nullable()->constrained('medicine_batches')->nullOnDelete();

            $table->enum('item_type', ['consultation', 'medicine', 'room', 'procedure', 'other']);
            $table->string('description');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2)->default(0);

            $table->timestamps();

            $table->index('bill_id');
            $table->index('inpatient_bill_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bill_items');
        Schema::dropIfExists('inpatient_bills');
        Schema::dropIfExists('outpatient_bills');
    }
};
