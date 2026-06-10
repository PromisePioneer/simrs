<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel Supplier/PBF
        Schema::create('pharmacy_suppliers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('name')->index();
            $table->string('code')->unique();
            $table->string('contact_person')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_account')->nullable();
            $table->string('bank_account_name')->nullable();
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->decimal('tax_percentage', 5, 2)->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        // Tabel Purchase Order (Surat Pemesanan)
        Schema::create('pharmacy_purchase_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('po_number')->unique();
            $table->foreignUuid('supplier_id')->constrained('pharmacy_suppliers')->cascadeOnDelete();
            $table->foreignUuid('warehouse_id')->constrained('medicine_warehouses')->cascadeOnDelete();
            $table->datetime('po_date');
            $table->datetime('expected_delivery_date')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'rejected', 'received', 'cancelled'])->default('draft');
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('tax_amount', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->uuid('created_by');
            $table->foreign('created_by')->references('id')->on('users')->cascadeOnDelete();
            $table->uuid('approved_by')->nullable();
            $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
            $table->datetime('approved_at')->nullable();
            $table->timestamps();
        });

        // Tabel PO Items
        Schema::create('pharmacy_purchase_order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('purchase_order_id')->constrained('pharmacy_purchase_orders')->cascadeOnDelete();
            $table->foreignUuid('medicine_id')->constrained('medicines')->cascadeOnDelete();
            $table->bigInteger('unit_id')->unsigned()->nullable();
            $table->integer('quantity');
            $table->decimal('unit_price', 15, 2);
            $table->integer('quantity_received')->default(0);
            $table->decimal('subtotal', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Tabel Penerimaan Barang (GRN - Goods Receipt Note)
        Schema::create('pharmacy_goods_receipt_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('grn_number')->unique();
            $table->foreignUuid('purchase_order_id')->constrained('pharmacy_purchase_orders')->cascadeOnDelete();
            $table->datetime('receipt_date');
            $table->enum('status', ['draft', 'partial', 'complete'])->default('draft');
            $table->text('notes')->nullable();
            $table->uuid('received_by');
            $table->foreign('received_by')->references('id')->on('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // Tabel GRN Items (dengan batch tracking)
        Schema::create('pharmacy_goods_receipt_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('goods_receipt_note_id')->constrained('pharmacy_goods_receipt_notes')->cascadeOnDelete();
            $table->foreignUuid('purchase_order_item_id')->constrained('pharmacy_purchase_order_items')->cascadeOnDelete();
            $table->foreignUuid('medicine_batch_id')->nullable()->constrained('medicine_batches')->nullOnDelete();
            $table->integer('quantity_received');
            $table->string('batch_number');
            $table->date('expiry_date');
            $table->date('manufacture_date')->nullable();
            $table->decimal('unit_price', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Tabel Retur ke Supplier
        Schema::create('pharmacy_purchase_returns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->string('return_number')->unique();
            $table->foreignUuid('purchase_order_id')->constrained('pharmacy_purchase_orders')->cascadeOnDelete();
            $table->foreignUuid('supplier_id')->constrained('pharmacy_suppliers')->cascadeOnDelete();
            $table->datetime('return_date');
            $table->enum('reason', ['expired', 'damaged', 'wrong_item', 'quality_issue', 'other'])->default('other');
            $table->text('reason_description')->nullable();
            $table->decimal('total_return_amount', 15, 2)->default(0);
            $table->enum('status', ['draft', 'submitted', 'approved', 'received_by_supplier'])->default('draft');
            $table->text('notes')->nullable();
            $table->uuid('created_by');
            $table->foreign('created_by')->references('id')->on('users')->cascadeOnDelete();
            $table->timestamps();
        });

        // Tabel Return Items
        Schema::create('pharmacy_purchase_return_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('purchase_return_id')->constrained('pharmacy_purchase_returns')->cascadeOnDelete();
            $table->foreignUuid('medicine_batch_id')->constrained('medicine_batches')->cascadeOnDelete();
            $table->integer('quantity_returned');
            $table->decimal('unit_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_purchase_return_items');
        Schema::dropIfExists('pharmacy_purchase_returns');
        Schema::dropIfExists('pharmacy_goods_receipt_items');
        Schema::dropIfExists('pharmacy_goods_receipt_notes');
        Schema::dropIfExists('pharmacy_purchase_order_items');
        Schema::dropIfExists('pharmacy_purchase_orders');
        Schema::dropIfExists('pharmacy_suppliers');
    }
};
