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
        Schema::create('medicine_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
            $table->string('name');
            $table->enum('type', ['general', 'medicine', 'medical_devices', 'service']);
            $table->timestamps();
        });


        Schema::create('medicine_warehouses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();

            $table->string('code')->unique();
            $table->string('name');
            $table->string('type');
            $table->timestamps();
        });


        Schema::create('medicine_racks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('warehouse_id')->nullable()->constrained('medicine_warehouses')->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->timestamps();
            $table->unique(['tenant_id', 'warehouse_id', 'code']);
        });

        Schema::create('medicines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('sku')->unique();
            $table->string('code');
            $table->string('name');
            $table->string('base_unit');
            $table->string('type');
            $table->boolean('must_has_receipt')->default(false);
            $table->boolean('is_for_sell')->default(true);
            $table->integer('minimum_stock_amount')->default(0);
            $table->foreignUuid('category_id')->constrained('medicine_categories')->cascadeOnDelete();
            $table->decimal('reference_purchase_price', 15, 2)->nullable();
            $table->timestamps();
        });

        Schema::create('medicine_batches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('medicine_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('warehouse_id')->constrained('medicine_warehouses')->cascadeOnDelete();
            $table->foreignUuid('rack_id')->nullable()->constrained('medicine_racks');
            $table->string('batch_number')->nullable();
            $table->boolean('is_auto_batch')->default(false);
            $table->date('expired_date')->nullable();
            $table->timestamps();
        });


        Schema::create('medicine_batch_stocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('batch_id')->constrained('medicine_batches')->cascadeOnDelete();
            $table->foreignUuid('warehouse_id')->constrained('medicine_warehouses')->cascadeOnDelete();
            $table->foreignUuid('rack_id')->constrained('medicine_racks')->cascadeOnDelete();
            $table->integer('stock_amount')->default(0);
        });

        Schema::create('medicine_units', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('medicine_id')->constrained('medicines')->cascadeOnDelete();
            $table->string('unit_name');
            $table->string('multiplier');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medicine_unit_types');
        Schema::dropIfExists('medicine_categories');
        Schema::dropIfExists('medicine_racks');
        Schema::dropIfExists('medicine_warehouses');
        Schema::dropIfExists('medicine-management');
    }
};
