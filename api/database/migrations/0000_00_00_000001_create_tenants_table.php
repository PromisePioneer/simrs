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
        Schema::create('tenants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique()->index();
            $table->string('name')->index();
            $table->enum('type', ['rs', 'klinik', 'beauty_clinic']);
            $table->string('nib')->nullable();
            $table->string('sio')->nullable();
            $table->string('npwp_full_name')->nullable();
            $table->string('npwp_type')->nullable();
            $table->string('nik_npwp')->nullable();
            $table->string('npwp_number')->nullable();
            $table->string('npwp_address')->nullable();
            $table->foreignUuid('npwp_province_id')->nullable()->constrained('provinces')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignUuid('npwp_district_id')->nullable()->constrained('districts')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('ktp_full_name')->nullable();
            $table->string('nik_ktp')->nullable();
            $table->string('ktp_attachment')->nullable();
            $table->string('pic_full_name')->nullable();
            $table->string('pic_role')->nullable();
            $table->string('pic_phone_number')->nullable();
            $table->string('pic_email')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
