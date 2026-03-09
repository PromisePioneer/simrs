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

        Schema::create('payment_method_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('payment_methods', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->foreignUuid('payment_method_type_id')->constrained('payment_method_types');
            $table->timestamps();
        });

        Schema::create('patients', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->index()->constrained('tenants')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('medical_record_number');
            $table->string('city_of_birth');
            $table->date('date_of_birth');
            $table->string('id_card_number');
            $table->enum('gender', ['pria', 'wanita']);
            $table->enum('religion', ['islam', 'protestan', 'katholik', 'hindu', 'budha', 'konghucu'])->nullable();
            $table->enum('blood_type', ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-'])->nullable();
            $table->string('job');
            $table->string('kis_number')->nullable();
            $table->string('phone');
            $table->string('email')->nullable();
            $table->date('date_of_consultation');
            $table->string('profile_picture')->nullable();
            $table->unique(['tenant_id', 'email']);
            $table->timestamps();
        });


        Schema::create('patient_payment_methods', function (Blueprint $table) {
            $table->foreignUuid('patient_id')->nullable()->constrained('patients')->cascadeOnDelete();
            $table->foreignUuid('payment_method_type_id')->nullable()->constrained('payment_method_types')->cascadeOnDelete();
            $table->string('bpjs_number')->nullable();
            $table->primary(['patient_id']);
        });


        Schema::create('patient_address', function (Blueprint $table) {
            $table->foreignUuid('patient_id')->index()->constrained('patients')->cascadeOnDelete();
            $table->text('address')->nullable();
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->string('subdistrict')->nullable();
            $table->string('ward')->nullable();
            $table->string('postal_code')->nullable();

            $table->primary(['patient_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patient_payment_methods');
        Schema::dropIfExists('patient_address');
        Schema::dropIfExists('patients');
    }
};
