<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('diagnoses', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('tenant_id')
                ->constrained('tenants')
                ->cascadeOnDelete();

            $table->foreignUuid('outpatient_visit_id')
                ->constrained('outpatient_visits')
                ->cascadeOnDelete();

            // Snapshot ICD-10
            $table->string('icd10_code', 10)->index();
            $table->string('description');

            $table->enum('type', ['primary', 'secondary', 'comorbid'])
                ->default('secondary')
                ->index();

            $table->boolean('is_confirmed')->default(true);

            $table->timestamps();

            $table->index(['tenant_id', 'outpatient_visit_id']);
            $table->unique([
                'outpatient_visit_id',
                'icd10_code',
                'type'
            ]);
        });


        Schema::create('procedures', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('tenant_id')
                ->constrained('tenants')
                ->cascadeOnDelete();

            $table->foreignUuid('outpatient_visit_id')
                ->constrained('outpatient_visits')
                ->cascadeOnDelete();

            // Snapshot ICD-9
            $table->string('icd9_code', 10)->index();
            $table->string('description');

            // Optional tapi recommended
            $table->foreignUuid('performed_by')->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->dateTime('procedure_date')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();

            // Index penting untuk reporting SaaS
            $table->index(['tenant_id', 'outpatient_visit_id']);
        });


        Schema::create('prescriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')
                ->constrained('tenants')
                ->cascadeOnDelete();

            $table->foreignUuid('outpatient_visit_id')
                ->constrained('outpatient_visits')
                ->cascadeOnDelete();

            $table->foreignUuid('medicine_id')
                ->constrained('medicines')
                ->restrictOnDelete();
            $table->string('dosage');        // 500mg, 1 tablet
            $table->string('frequency');     // 3x1
            $table->string('duration')->nullable();  // 3 hari
            $table->string('route')->nullable();     // oral, iv, dll

            $table->decimal('quantity', 10, 2)->nullable(); // jumlah yang diberikan
            $table->string('status')->default('draft'); // draft | approved | dispended | cancelled
            $table->text('notes')->nullable();
            $table->foreignUuid('dispensed_by')->nullable()->constrained('users');
            $table->timestamp('dispensed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diagnoses');
    }
};
