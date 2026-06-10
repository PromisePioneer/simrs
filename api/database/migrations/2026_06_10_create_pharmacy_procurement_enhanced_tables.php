<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ====================================================================
        // PHARMACY PURCHASE ORDER TABLES
        // ====================================================================
        
        Schema::create('pharmacy_purchase_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('po_number')->unique();
            $table->uuid('supplier_id')->index();
            $table->uuid('warehouse_id')->index();
            $table->date('po_date');
            $table->date('expected_delivery_date')->nullable();
            
            // Status workflow: draft → submitted → reviewed → approved → confirmed → received
            $table->enum('status', [
                'draft',
                'submitted',
                'reviewed',
                'approved',
                'rejected',
                'confirmed',
                'cancelled',
                'received',
                'partial_received'
            ])->default('draft')->index();
            
            // Delivery tracking
            $table->enum('delivery_status', [
                'pending',
                'in_transit',
                'partial_delivered',
                'delivered',
                'cancelled'
            ])->default('pending')->nullable();
            
            // Amount fields
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->decimal('total_discount', 15, 2)->default(0);
            $table->decimal('total_tax', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            
            // Payment & delivery terms
            $table->string('payment_terms')->default('net30'); // net30, net60, cod, etc
            $table->text('delivery_address')->nullable();
            
            // Workflow timestamps
            $table->timestamp('submitted_at')->nullable();
            $table->uuid('submitted_by')->nullable()->index();
            $table->timestamp('reviewed_at')->nullable();
            $table->uuid('reviewed_by')->nullable()->index();
            $table->timestamp('approved_at')->nullable();
            $table->uuid('approved_by')->nullable()->index();
            $table->timestamp('confirmed_at')->nullable();
            $table->uuid('confirmed_by')->nullable()->index();
            
            // Rejection/Cancellation
            $table->timestamp('rejected_at')->nullable();
            $table->uuid('rejected_by')->nullable()->index();
            $table->text('rejection_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->uuid('cancelled_by')->nullable()->index();
            $table->text('cancellation_reason')->nullable();
            
            // Delivery tracking
            $table->timestamp('actual_delivery_date')->nullable();
            $table->string('tracking_number')->nullable();
            $table->text('delivery_notes')->nullable();
            $table->timestamp('delivery_status_updated_at')->nullable();
            
            // Supplier coordination
            $table->string('supplier_po_number')->nullable();
            $table->string('supplier_contact')->nullable();
            
            // Additional data
            $table->text('submission_notes')->nullable();
            $table->text('approval_notes')->nullable();
            $table->text('notes')->nullable();
            
            // Audit trail
            $table->uuid('created_by')->index();
            $table->uuid('updated_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for common queries
            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'po_date']);
            $table->index(['supplier_id', 'status']);
            $table->index(['warehouse_id', 'status']);
        });

        Schema::create('pharmacy_purchase_order_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('po_id')->index();
            $table->uuid('medicine_id')->index();
            $table->integer('quantity_ordered');
            $table->integer('quantity_received')->default(0);
            $table->decimal('unit_price', 15, 2);
            $table->decimal('line_total', 15, 2);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->foreign('po_id')
                ->references('id')
                ->on('pharmacy_purchase_orders')
                ->onDelete('cascade');
        });

        // ====================================================================
        // GOODS RECEIPT NOTES (GRN) TABLES
        // ====================================================================
        
        Schema::create('pharmacy_goods_receipts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('grn_number')->unique();
            $table->uuid('po_id')->index();
            $table->uuid('supplier_id')->index();
            $table->uuid('warehouse_id')->index();
            $table->date('receipt_date');
            
            // Status: in_progress → finalized → posted
            $table->enum('status', [
                'in_progress',
                'finalized',
                'posted',
                'cancelled'
            ])->default('in_progress')->index();
            
            // Summary data
            $table->integer('total_items')->default(0);
            $table->integer('total_received')->default(0);
            $table->integer('variance_items')->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            
            // Quality inspection
            $table->enum('inspection_status', [
                'pending',
                'in_progress',
                'passed',
                'partial_passed',
                'rejected'
            ])->default('pending')->nullable();
            $table->json('quality_inspection_notes')->nullable();
            
            // User tracking
            $table->uuid('received_by_user_id')->index();
            $table->uuid('finalized_by')->nullable()->index();
            $table->uuid('posted_by')->nullable()->index();
            
            // Timestamps
            $table->timestamp('received_at');
            $table->timestamp('finalized_at')->nullable();
            $table->timestamp('posted_at')->nullable();
            
            // Additional data
            $table->text('notes')->nullable();
            
            // Audit
            $table->uuid('created_by')->index();
            $table->uuid('updated_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('po_id')
                ->references('id')
                ->on('pharmacy_purchase_orders');
        });

        Schema::create('pharmacy_receipt_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('grn_id')->index();
            $table->uuid('po_item_id')->nullable()->index();
            $table->uuid('medicine_id')->index();
            
            // Batch information (critical for traceability)
            $table->string('batch_number');
            $table->date('expiry_date');
            
            // Quantity tracking
            $table->integer('quantity_ordered')->default(0);
            $table->integer('quantity_received');
            $table->integer('variance')->default(0); // received - ordered
            $table->decimal('unit_price', 15, 2);
            $table->decimal('line_total', 15, 2);
            
            // Condition assessment
            $table->enum('condition_status', [
                'good',
                'damaged',
                'incomplete',
                'rejected'
            ])->default('good');
            
            // Additional data
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->foreign('grn_id')
                ->references('id')
                ->on('pharmacy_goods_receipts')
                ->onDelete('cascade');
            
            $table->index(['batch_number', 'expiry_date']);
            $table->index(['medicine_id', 'batch_number']);
        });

        // ====================================================================
        // QUALITY INSPECTION TABLES
        // ====================================================================
        
        Schema::create('pharmacy_quality_inspections', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('grn_id')->index();
            
            // Inspection details
            $table->enum('inspection_type', [
                'physical_check',
                'temperature_check',
                'expiry_verification',
                'batch_verification',
                'quantity_verification',
                'full_inspection'
            ])->default('full_inspection');
            
            $table->enum('status', [
                'pending',
                'in_progress',
                'passed',
                'rejected',
                'partial_passed'
            ])->default('pending')->index();
            
            // Inspection results
            $table->json('inspection_findings')->nullable();
            $table->text('inspection_notes')->nullable();
            $table->integer('items_passed')->default(0);
            $table->integer('items_rejected')->default(0);
            $table->integer('items_partial')->default(0);
            
            // Inspector info
            $table->uuid('inspected_by')->index();
            $table->timestamp('inspected_at')->nullable();
            
            // Approval
            $table->uuid('approved_by')->nullable()->index();
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();
            
            // Rejection handling
            $table->uuid('rejected_by')->nullable()->index();
            $table->timestamp('rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
            
            $table->timestamps();
            
            $table->foreign('grn_id')
                ->references('id')
                ->on('pharmacy_goods_receipts');
        });

        // ====================================================================
        // RECEIPT VARIANCE TRACKING
        // ====================================================================
        
        Schema::create('pharmacy_receipt_variances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('receipt_item_id')->index();
            $table->uuid('grn_id')->index();
            
            // Variance details
            $table->integer('quantity_ordered');
            $table->integer('quantity_received');
            $table->integer('variance_quantity');
            
            $table->enum('variance_type', [
                'over_received',
                'under_received',
                'damaged',
                'expired_on_receipt',
                'wrong_medicine',
                'wrong_batch',
                'incomplete_batch'
            ])->index();
            
            // Resolution
            $table->enum('status', [
                'flagged',
                'investigating',
                'resolved',
                'escalated'
            ])->default('flagged')->index();
            
            $table->text('variance_reason')->nullable();
            $table->text('resolution_notes')->nullable();
            
            // Resolution tracking
            $table->uuid('resolved_by')->nullable()->index();
            $table->timestamp('resolved_at')->nullable();
            
            // Action taken
            $table->enum('action_taken', [
                'accepted',
                'returned_to_supplier',
                'credit_note_issued',
                'supplier_contacted',
                'investigation_ongoing'
            ])->default('accepted')->nullable();
            
            $table->timestamps();
            
            $table->foreign('grn_id')
                ->references('id')
                ->on('pharmacy_goods_receipts');
        });

        // ====================================================================
        // SUPPLIER MANAGEMENT ENHANCEMENT
        // ====================================================================
        
        Schema::create('pharmacy_supplier_performance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('supplier_id')->index();
            
            // Performance metrics
            $table->integer('total_po_count')->default(0);
            $table->decimal('on_time_delivery_percentage', 5, 2)->default(0);
            $table->decimal('accuracy_percentage', 5, 2)->default(0); // variance-free receipts
            $table->decimal('quality_percentage', 5, 2)->default(0); // quality passed
            
            // Rating
            $table->enum('rating', [
                'excellent',
                'good',
                'average',
                'poor'
            ])->default('good');
            
            // Last period data
            $table->integer('late_deliveries')->default(0);
            $table->integer('variance_count')->default(0);
            $table->integer('quality_issues')->default(0);
            
            // Average lead time (days)
            $table->decimal('avg_lead_time_days', 5, 2)->default(0);
            
            // Last updated
            $table->timestamp('last_calculated_at')->nullable();
            $table->timestamps();
            
            $table->index(['tenant_id', 'rating']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pharmacy_supplier_performance');
        Schema::dropIfExists('pharmacy_receipt_variances');
        Schema::dropIfExists('pharmacy_quality_inspections');
        Schema::dropIfExists('pharmacy_receipt_items');
        Schema::dropIfExists('pharmacy_goods_receipts');
        Schema::dropIfExists('pharmacy_purchase_order_items');
        Schema::dropIfExists('pharmacy_purchase_orders');
    }
};
