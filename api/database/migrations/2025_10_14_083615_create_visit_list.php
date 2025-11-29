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


        Schema::create('visit_list', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->enum('type', ['non_rujuk', 'rujuk'])->nullable();
            $table->string('referred_hospital')->nullable();
            $table->string('referred_doctor')->nullable();
            $table->foreignUuid('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignUuid('doctor_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('poli_id')->constrained('poli')->cascadeOnDelete();
            $table->dateTime('date')->nullable();
            $table->timestamps();
        });


        Schema::create('patients_vital_sign', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('visit_list_id')->constrained('visit_list')->cascadeOnDelete();
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
            $table->foreignUuid('visit_list_id')->constrained('visit_list')->cascadeOnDelete();
            $table->string('full_name')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
        });

        Schema::create('patient_allergies', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('visit_list_id')->constrained('visit_list')->cascadeOnDelete();
            $table->json('patient_allergy')->nullable();
            $table->json('patient_medical_history')->nullable();
            $table->json('patient_family_medical_history')->nullable();
            $table->json('patient_medication_history')->nullable();
        });


        Schema::create('patient_psychosocial_and_spirituals', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('visit_list_id')->constrained('visit_list')->cascadeOnDelete();
            $table->json('psychology_condition')->nullable();
            $table->enum('marital_status', ['menikah', 'belum_menikah', 'janda_atau_duda'])->nullable();
            $table->enum('live_with', ['sendiri', 'orang_tua', 'suami_atau_istri', 'lainnya'])->nullable();
            $table->enum('job', ['wiraswasta', 'swasta', 'pns', 'lainnya'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visit_list');
    }
};
