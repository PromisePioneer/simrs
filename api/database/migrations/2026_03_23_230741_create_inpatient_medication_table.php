<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inpatient_daily_medications', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignUuid('tenant_id')
                ->constrained('tenants')
                ->cascadeOnDelete();

            $table->foreignUuid('inpatient_admission_id')
                ->constrained('inpatient_admissions')
                ->cascadeOnDelete();

            $table->foreignUuid('medicine_id')
                ->constrained('medicines')
                ->cascadeOnDelete();

            $table->foreignUuid('prescribed_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignUuid('dispensed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('dosage');           // e.g. "500mg"
            $table->string('frequency');        // e.g. "3x sehari"
            $table->string('route');            // e.g. "oral", "IV", "IM"
            $table->integer('quantity');        // total units to dispense
            $table->string('status')->default('draft'); // draft | dispensed | cancelled
            $table->text('notes')->nullable();
            $table->dateTime('dispensed_at')->nullable();
            $table->date('given_date');         // tanggal pemberian obat

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inpatient_daily_medications');
    }
};
