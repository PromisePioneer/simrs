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

        Schema::create('plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->string('billing_period'); // monthly, yearly
            $table->integer('max_users')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });


        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('plan_id')->constrained('plans')->onDelete('cascade');
            $table->string('order_number')->unique();
            $table->decimal('amount', 10, 2);
            $table->decimal('total', 10, 2);
            $table->string('status'); // pending, paid, failed, cancelled, expired
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });


        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('order_id')->constrained('orders')->cascadeOnDelete();
            $table->string('gateway_transaction_id')->nullable(); // ID transaksi dari gateway
            $table->string('payment_type')->nullable(); // credit_card, bank_transfer, gopay, ovo, dll
            $table->decimal('amount', 10, 2);
            $table->string('status'); // pending, success, failed, expired
            $table->string('payment_url')->nullable();
            $table->json('gateway_response')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });


        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('plan_id')->constrained('plans')->onDelete('cascade');
            $table->string('status'); // active, cancelled, expired, trialing
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('starts_at');
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamps();
        });


        Schema::create('plan_module', function (Blueprint $table) {
            $table->foreignUuid('plan_id')->constrained()->onDelete('cascade');
            $table->uuid('module_id');
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
            $table->boolean('is_accessible')->default(true);
            $table->integer('limit')->nullable();
            $table->primary(['plan_id', 'module_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('plan_module');
    }
};
