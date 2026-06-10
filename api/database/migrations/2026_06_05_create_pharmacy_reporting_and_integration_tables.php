<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ============ REPORTING TABLES ============
        Schema::create('pharmacy_usage_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('medicine_id')->index();
            $table->date('report_date');
            $table->string('report_period', 50); // daily, weekly, monthly
            $table->integer('total_units_sold')->default(0);
            $table->decimal('total_revenue', 15, 2)->default(0);
            $table->decimal('total_cost', 15, 2)->default(0);
            $table->decimal('total_profit', 15, 2)->default(0);
            $table->decimal('profit_margin_percentage', 5, 2)->default(0);
            $table->string('movement_category', 50); // fast_moving, normal, slow_moving
            $table->integer('stock_on_hand')->default(0);
            $table->integer('days_stock_on_hand')->nullable();
            $table->text('analysis_notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pharmacy_narcotics_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('medicine_id')->index();
            $table->date('report_date');
            $table->string('report_period', 50); // daily, weekly, monthly
            $table->integer('opening_stock')->default(0);
            $table->integer('quantity_received')->default(0);
            $table->integer('quantity_dispensed')->default(0);
            $table->integer('quantity_returned')->default(0);
            $table->integer('quantity_destroyed')->default(0);
            $table->integer('closing_stock')->default(0);
            $table->text('destruction_notes')->nullable();
            $table->uuid('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->boolean('submitted_to_dinkes')->default(false);
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
        });

        Schema::create('pharmacy_financial_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->date('report_date');
            $table->string('report_period', 50); // daily, weekly, monthly
            $table->decimal('total_sales', 15, 2)->default(0);
            $table->decimal('total_discount', 15, 2)->default(0);
            $table->decimal('total_tax', 15, 2)->default(0);
            $table->decimal('net_sales', 15, 2)->default(0);
            $table->decimal('total_cost_of_goods_sold', 15, 2)->default(0);
            $table->decimal('gross_profit', 15, 2)->default(0);
            $table->decimal('gross_profit_percentage', 5, 2)->default(0);
            $table->decimal('operating_expenses', 15, 2)->default(0);
            $table->decimal('net_profit', 15, 2)->default(0);
            $table->decimal('net_profit_percentage', 5, 2)->default(0);
            $table->integer('total_transactions')->default(0);
            $table->integer('total_items_sold')->default(0);
            $table->decimal('average_transaction_value', 10, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pharmacy_defecta_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('medicine_id')->index();
            $table->date('report_date');
            $table->string('defecta_reason', 100); // low_stock, expired_soon, inactive, high_demand
            $table->integer('current_stock')->default(0);
            $table->integer('minimum_stock')->default(0);
            $table->integer('reorder_quantity')->default(0);
            $table->decimal('estimated_cost', 15, 2)->default(0);
            $table->integer('days_until_stockout')->nullable();
            $table->boolean('is_urgent')->default(false);
            $table->boolean('is_ordered')->default(false);
            $table->uuid('ordered_by')->nullable();
            $table->timestamp('ordered_at')->nullable();
            $table->uuid('po_id')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pharmacy_general_ledger_stock', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('medicine_batch_id')->index();
            $table->date('transaction_date');
            $table->string('transaction_type', 50); // receipt, sale, return, adjustment, transfer, opname
            $table->string('reference_type', 50); // po_id, grn_id, sales_id, return_id, transfer_id, opname_id
            $table->uuid('reference_id')->nullable();
            $table->integer('quantity_in')->default(0);
            $table->integer('quantity_out')->default(0);
            $table->integer('balance')->default(0);
            $table->decimal('unit_cost', 10, 2)->default(0);
            $table->decimal('transaction_amount', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->uuid('created_by');
            $table->timestamps();
        });

        Schema::create('pharmacy_inventory_summary', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('warehouse_id')->index();
            $table->uuid('medicine_id')->index();
            $table->integer('total_quantity')->default(0);
            $table->decimal('total_value', 15, 2)->default(0);
            $table->decimal('average_unit_cost', 10, 2)->default(0);
            $table->integer('batch_count')->default(0);
            $table->date('first_batch_received')->nullable();
            $table->date('latest_batch_received')->nullable();
            $table->date('earliest_expiry_date')->nullable();
            $table->integer('items_expiring_soon')->default(0);
            $table->integer('items_expired')->default(0);
            $table->timestamp('last_updated_at')->useCurrent();
            $table->timestamps();
        });

        // ============ BATCH TRACKING FOR RECALL ============
        Schema::create('pharmacy_batch_recall_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('medicine_batch_id')->index();
            $table->string('recall_reason', 100); // quality_issue, expiry, contamination, bpom_notice
            $table->date('recall_date');
            $table->text('recall_description');
            $table->uuid('recalled_by');
            $table->timestamp('recalled_at');
            $table->integer('initial_quantity_received')->default(0);
            $table->integer('quantity_distributed')->default(0);
            $table->integer('quantity_returned')->default(0);
            $table->integer('quantity_destroyed')->default(0);
            $table->integer('quantity_unaccounted')->default(0);
            $table->string('recall_status', 50); // in_progress, completed, documented
            $table->uuid('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->text('recall_summary')->nullable();
            $table->timestamps();
        });

        // ============ EXTERNAL BRIDGE & SATUSEHAT ============
        Schema::create('pharmacy_external_sync_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('external_system', 50); // satusehat, bpom, health_ministry, regional_authority
            $table->string('sync_type', 50); // medicine_data, usage_report, narcotics_report, inventory_sync
            $table->json('request_data')->nullable();
            $table->json('response_data')->nullable();
            $table->string('sync_status', 50); // pending, success, failed, partial
            $table->text('error_message')->nullable();
            $table->integer('records_synced')->default(0);
            $table->integer('records_failed')->default(0);
            $table->uuid('initiated_by');
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('pharmacy_satusehat_mappings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('medicine_id')->index();
            $table->string('satusehat_code', 100)->unique();
            $table->string('satusehat_name', 200);
            $table->string('satusehat_unit', 50);
            $table->string('satusehat_form', 100);
            $table->string('satusehat_strength', 100)->nullable();
            $table->boolean('is_narcotics')->default(false);
            $table->boolean('is_psychotropics')->default(false);
            $table->boolean('is_precursor')->default(false);
            $table->timestamp('last_validated_at')->nullable();
            $table->boolean('is_valid')->default(true);
            $table->text('validation_errors')->nullable();
            $table->timestamps();
        });

        Schema::create('pharmacy_government_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('report_type', 100); // narcotics_monthly, usage_analysis, defecta, inventory_status
            $table->string('reporting_period', 50); // 2026-06, 2026-W23, 2026-06-05
            $table->string('recipient_agency', 100); // dinkes, bpom, regional_health_authority
            $table->string('report_format', 50); // pdf, excel, xml, json
            $table->text('report_file_path')->nullable();
            $table->string('submission_status', 50); // draft, ready, submitted, acknowledged, failed
            $table->json('submission_details')->nullable();
            $table->uuid('prepared_by');
            $table->timestamp('prepared_at');
            $table->uuid('submitted_by')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->uuid('acknowledged_by')->nullable();
            $table->timestamp('acknowledged_at')->nullable();
            $table->text('submission_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_government_reports');
        Schema::dropIfExists('pharmacy_satusehat_mappings');
        Schema::dropIfExists('pharmacy_external_sync_logs');
        Schema::dropIfExists('pharmacy_batch_recall_history');
        Schema::dropIfExists('pharmacy_inventory_summary');
        Schema::dropIfExists('pharmacy_general_ledger_stock');
        Schema::dropIfExists('pharmacy_defecta_reports');
        Schema::dropIfExists('pharmacy_financial_reports');
        Schema::dropIfExists('pharmacy_narcotics_reports');
        Schema::dropIfExists('pharmacy_usage_reports');
    }
};
