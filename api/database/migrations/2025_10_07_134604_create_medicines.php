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

        Schema::create('medicine_unit_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('medicine_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->enum('type', ['general', 'medicine', 'medical_devices', 'service']);
            $table->timestamps();
        });


        Schema::create('medicine_warehouses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('medicine_racks', function (Blueprint $table) {
//            $table->uuid('id')->primary();
//            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
//            $table->foreignUuid('warehouse_id')->constrained('medicine_categories')->cascadeOnDelete();
//            $table->string('code');
//            $table->string('name');
//            $table->timestamps();
        });


        Schema::create('medicines', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('sku');
            $table->string('name');
            $table->string('code');
            $table->boolean('must_has_receipt')->default(false);
            $table->enum('type', ['general', 'medicine', 'medical_devices', 'service']);
            $table->foreignUuid('warehouse_id')->constrained('medicine_warehouses')->cascadeOnDelete();
            $table->foreignUuid('category_id')->constrained('medicine_categories')->cascadeOnDelete();
            $table->foreignUuid('unit_type_id')->constrained('medicine_unit_types')->cascadeOnDelete();
            $table->boolean('is_for_sell')->default(false);
            $table->date('expired_date')->nullable();
            $table->double('expired_notification_days')->nullable();
            $table->double('stock_amount')->default(0);
            $table->double('minimum_stock_amount')->nullable();
            $table->double('maximum_stock_amount')->nullable();
            $table->double('reference_purchase_price')->nullable();
            $table->timestamps();
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
        Schema::dropIfExists('medicines');
    }
};
