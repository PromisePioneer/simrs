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
        Schema::create('inpatient_admissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')
                ->constrained('tenants')
                ->cascadeOnDelete();
            $table->foreignUuid('patient_id')
                ->constrained('patients')
                ->cascadeOnDelete();
            $table->foreignUuid('doctor_id')
                ->constrained('users')
                ->cascadeOnDelete();
            $table->dateTime('admitted_at');
            $table->dateTime('discharged_at')->nullable();
            $table->string('admission_source')->nullable(); // IGD, Rawat Jalan, Rujukan
            $table->string('status')->default('admitted'); // admitted, discharged, cancelled
            $table->text('diagnosis')->nullable();

            $table->timestamps();
        });


        Schema::create('bed_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('inpatient_admission_id')
                ->constrained('inpatient_admissions')
                ->cascadeOnDelete();

            $table->foreignUuid('bed_id')
                ->constrained('beds')
                ->cascadeOnDelete();

            $table->dateTime('assigned_at');

            $table->dateTime('released_at')->nullable();

            $table->timestamps();
        });


        Schema::create('inpatient_vital_signs', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('inpatient_admission_id')
                ->constrained('inpatient_admissions')
                ->cascadeOnDelete();

            $table->double('temperature')->nullable();
            $table->double('pulse_rate')->nullable();
            $table->double('respiratory_rate')->nullable();
            $table->double('systolic')->nullable();
            $table->double('diastolic')->nullable();

            $table->timestamps();
        });


        Schema::create('inpatient_daily_cares', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('inpatient_admission_id')
                ->constrained('inpatient_admissions')
                ->cascadeOnDelete();

            $table->foreignUuid('doctor_id')
                ->constrained('users');

            $table->text('notes')->nullable();

            $table->timestamps();
        });


        Schema::create('inpatient_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('tenant_id')
                ->constrained('tenants');

            $table->foreignUuid('inpatient_admission_id')
                ->constrained('inpatient_admissions');

            $table->string('invoice_number')->unique();

            $table->double('subtotal')->default(0);
            $table->double('tax')->default(0);
            $table->double('total')->default(0);

            $table->string('payment_status')->default('unpaid');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inpatient_admissions');
        Schema::dropIfExists('bed_assignments');
        Schema::dropIfExists('inpatient_vital_signs');
        Schema::dropIfExists('inpatient_daily_cares');
        Schema::dropIfExists('inpatient_payments');
    }
};
