<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    private const DISCHARGE_STATUS = [
        'healthy', 'refered', 'aps', '+', 'deceased', 'recovered', 'improving', 'forcingly_discharged', '-', 'moved_room', 'status_incomplete', 'with_doctor_approval', 'at_own_request', 'isolating', 'other'
    ];

    private const VISIT_STATUS = [
        'not_yet', 'already', 'canceled', 'files_received', 'refered', 'died', 'in_treatment', 'forced_return',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('visit_number')
                ->comment('Unique SIK visit number, format: YYYY/MM/DD/XXXXXX');
            $table->string('reg_number')->nullable();
            $table->dateTime('date');
            $table->string('emr')->nullable();

            $table->string('guarantor_name')->nullable();
            $table->text('guarantor_address')->nullable();
            $table->string('guarantor_relationship')->nullable();
            $table->double('registration_fee')->nullable();
            $table->enum('status', self::VISIT_STATUS)->nullable();
            $table->enum('registration_status', ['-', 'old', 'new'])->default('-');
            $table->enum('advanced_status', ['inpatient', 'outpatient'])->default('inpatient');

            $table->foreignUuid('outpatient_visit_id')->nullable()
                ->constrained('outpatient_visits')->nullOnDelete();
            $table->foreignUuid('inpatient_admission_id')->nullable()
                ->constrained('inpatient_admissions')->nullOnDelete();
            $table->foreignUuid('patient_id')->nullable()
                ->constrained('patients')->nullOnDelete();
            $table->foreignUuid('tenant_id')
                ->constrained('tenants')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
