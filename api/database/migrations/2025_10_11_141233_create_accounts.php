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

        Schema::create('account_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('accounts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->constrained('tenants')->cascadeOnDelete();
            $table->foreignUuid('account_category_id')->constrained('account_categories')->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->uuid('parent_id');
            $table->timestamps();
        });

        Schema::table('accounts', function (Blueprint $table) {
            $table->foreign('parent_id')
                ->references('id')
                ->on('accounts')
                ->onDelete('cascade');
        });


        Schema::create('account_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->foreignUuid('tenant_id')
                ->constrained('tenants')
                ->cascadeOnDelete();
            $table->foreignUuid('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->enum('type', ['debit', 'credit']);
            $table->string('description');
            $table->double('amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
