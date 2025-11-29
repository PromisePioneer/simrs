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

        Schema::create('product_unit_types', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('product_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->enum('type', ['general', 'medicine', 'medical_devices', 'service']);
            $table->timestamps();
        });

        Schema::create('product_racks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('product_warehouses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->timestamps();
        });


        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('sku');
            $table->string('name');
            $table->string('code');
            $table->boolean('must_has_receipt')->default(false);
            $table->enum('type', ['general', 'medicine', 'medical_devices', 'service']);
            $table->foreignUuid('warehouse_id')->constrained('product_warehouses')->cascadeOnDelete();
            $table->foreignUuid('category_id')->constrained('product_categories')->cascadeOnDelete();
            $table->foreignUuid('rack_id')->constrained('product_racks')->cascadeOnDelete();
            $table->foreignUuid('unit_type_id')->constrained('product_unit_types')->cascadeOnDelete();
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
        Schema::dropIfExists('product_unit_types');
        Schema::dropIfExists('product_categories');
        Schema::dropIfExists('product_warehouses');
        Schema::dropIfExists('products');
    }
};
