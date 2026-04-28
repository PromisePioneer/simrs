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
        Schema::create('diseases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('tenant_id')->nullable()->constrained('tenants')->cascadeOnDelete();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('symptoms')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['infectious', 'not_contagious'])->default('not_contagious');
            $table->enum('valid_code', ['0', '1'])->default('1');
            $table->enum('accpdx', ['Y', 'N'])->default('Y')
                ->comment('Acceptable as primary diagnosis (Y/N)');
            $table->enum('asterisk', ['0', '1'])->default('0')
                ->comment('ICD-10 dagger / asterisk code');
            $table->enum('im', ['0', '1'])->default('0')
                ->comment('Infectious / manifestation code');
            $table->timestamps();


            $table->unique(['tenant_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diseases');
    }
};
