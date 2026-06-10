<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ============ STOCK TRANSFER TABLES ============
        Schema::create('pharmacy_stock_transfers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('transfer_number', 50)->unique();
            $table->uuid('source_warehouse_id')->index();
            $table->uuid('destination_warehouse_id')->index();
            $table->timestamp('transfer_date')->nullable();
            $table->timestamp('received_date')->nullable();
            $table->enum('status', ['draft', 'approved', 'sent', 'received', 'cancelled'])->default('draft');
            $table->text('notes')->nullable();
            $table->uuid('created_by')->nullable();
            $table->uuid('approved_by')->nullable();
            $table->uuid('received_by')->nullable();
            $table->timestamps();
        });

        Schema::create('pharmacy_stock_transfer_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('transfer_id');
            $table->uuid('medicine_batch_id')->index();
            $table->integer('quantity_requested')->default(0);
            $table->integer('quantity_sent')->default(0);
            $table->integer('quantity_received')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('transfer_id')
                ->references('id')
                ->on('pharmacy_stock_transfers')
                ->onDelete('cascade');
        });

        // ============ STOCK OPNAME TABLES ============
        Schema::create('pharmacy_stock_opnames', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('opname_number', 50)->unique();
            $table->uuid('warehouse_id')->index();
            $table->date('opname_date');
            $table->enum('status', ['draft', 'in_progress', 'finalized', 'reconciled'])->default('draft');
            $table->uuid('started_by')->nullable();
            $table->uuid('finalized_by')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finalized_at')->nullable();
            $table->decimal('total_variance_amount', 15, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('pharmacy_stock_opname_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('opname_id');
            $table->uuid('medicine_batch_id')->index();
            $table->integer('system_quantity')->default(0);
            $table->integer('physical_quantity')->default(0);
            $table->integer('variance')->default(0);
            $table->decimal('variance_amount', 15, 2)->default(0);
            $table->string('variance_reason', 100)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('opname_id')
                ->references('id')
                ->on('pharmacy_stock_opnames')
                ->onDelete('cascade');
        });

        // ============ ALERT HISTORY TABLES ============
        Schema::create('pharmacy_alert_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('alert_id')->index();
            $table->string('action', 50);
            $table->text('action_notes')->nullable();
            $table->uuid('action_by');
            $table->timestamp('action_at')->useCurrent();
            $table->string('status_before', 50)->nullable();
            $table->string('status_after', 50)->nullable();
            $table->timestamps();

            $table->foreign('alert_id')
                ->references('id')
                ->on('pharmacy_safety_alerts')
                ->onDelete('cascade');
        });

        Schema::create('pharmacy_alert_escalations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('alert_id')->index();
            $table->string('escalation_level', 50); // warning, critical, urgent
            $table->timestamp('escalated_at');
            $table->uuid('escalated_by');
            $table->json('recipients')->nullable(); // array of user IDs
            $table->text('escalation_message')->nullable();
            $table->boolean('is_resolved')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->foreign('alert_id')
                ->references('id')
                ->on('pharmacy_safety_alerts')
                ->onDelete('cascade');
        });

        // ============ INSTRUCTION TEMPLATES ============
        Schema::create('pharmacy_instruction_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->text('template_format'); // Template untuk aturan pakai
            $table->boolean('is_active')->default(true);
            $table->uuid('created_by');
            $table->timestamps();
        });

        Schema::create('pharmacy_instruction_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('template_id');
            $table->uuid('medicine_id')->nullable()->index();
            $table->integer('age_min')->nullable();
            $table->integer('age_max')->nullable();
            $table->string('frequency', 100); // 3x sehari, 2x12 jam, dst
            $table->string('dosage', 100);
            $table->integer('duration')->nullable(); // hari
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->foreign('template_id')
                ->references('id')
                ->on('pharmacy_instruction_templates')
                ->onDelete('cascade');
        });

        // ============ KFA SATUSEHAT MAPPING ============
        Schema::create('pharmacy_kfa_mapping', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('medicine_id')->unique();
            $table->string('kfa_code', 50);
            $table->string('kfa_name', 200);
            $table->string('kfa_unit', 20);
            $table->string('kfa_category', 100)->nullable();
            $table->timestamp('last_sync_date')->nullable();
            $table->boolean('is_valid')->default(true);
            $table->text('mapping_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_kfa_mapping');
        Schema::dropIfExists('pharmacy_instruction_rules');
        Schema::dropIfExists('pharmacy_instruction_templates');
        Schema::dropIfExists('pharmacy_alert_escalations');
        Schema::dropIfExists('pharmacy_alert_histories');
        Schema::dropIfExists('pharmacy_stock_opname_items');
        Schema::dropIfExists('pharmacy_stock_opnames');
        Schema::dropIfExists('pharmacy_stock_transfer_items');
        Schema::dropIfExists('pharmacy_stock_transfers');
    }
};
