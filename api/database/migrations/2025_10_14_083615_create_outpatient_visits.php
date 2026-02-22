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
        Schema::create('allergies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->timestamps();
        });


        Schema::create('outpatient_visits', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('type');
            $table->string('referred_hospital')->nullable();
            $table->string('referred_doctor')->nullable();
            $table->foreignUuid('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignUuid('doctor_id')->constrained('users')->cascadeOnDelete();
            $table->dateTime('date')->nullable();
            $table->string('status')->default('waiting');
            $table->text('complain');
            $table->timestamps();
        });


        Schema::create('patients_vital_sign', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('outpatient_visit_id')->constrained('outpatient_visits')->cascadeOnDelete();
            $table->foreignUuid('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->double('height')->nullable();
            $table->double('weight')->nullable();
            $table->double('temperature')->nullable();
            $table->double('pulse_rate')->nullable();
            $table->double('respiratory_frequency')->nullable();
            $table->double('systolic')->nullable();
            $table->double('diastolic')->nullable();
            $table->double('abdominal_circumference')->nullable();
            $table->double('blood_sugar')->nullable();
            $table->double('oxygen_saturation')->nullable();
            $table->timestamps();
        });

        Schema::create('patient_companions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('outpatient_visit_id')->constrained('outpatient_visits')->cascadeOnDelete();
            $table->string('full_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
        });

        Schema::create('patient_allergies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('outpatient_visit_id')->constrained('outpatient_visits')->cascadeOnDelete();
            $table->json('patient_allergy')->nullable();
        });


        Schema::create('patient_medical_history', function (Blueprint $table) { //riwayat penyakit
            $table->uuid('id')->primary();
            $table->foreignUuid('outpatient_visit_id')->constrained('outpatient_visits')->cascadeOnDelete();
            $table->json('medical_history')->nullable();
        });

        Schema::create('patient_family_medical_history', function (Blueprint $table) { //riwayat penyakit keluarga
            $table->uuid('id')->primary();
            $table->foreignUuid('outpatient_visit_id')->constrained('outpatient_visits')->cascadeOnDelete();
            $table->json('family_medical_history')->nullable();
        });


        Schema::create('patient_psychosocial_and_spirituals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('outpatient_visit_id')->constrained('outpatient_visits')->cascadeOnDelete();
            $table->json('psychology_condition')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('live_with')->nullable();
            $table->string('job')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outpatient_visits');
    }
};
