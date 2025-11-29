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
        Schema::create('provinces', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->integer('old_id')->unique()->nullable();
            $table->string('name');
        });

        Schema::create('regencies', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->string('name', 50);
            $table->string('old_id');
            $table->string('old_province_id')->index();
            $table->foreignUuid('province_id')->references('id')->on('provinces')->onDelete('restrict')->onUpdate('cascade');
        });


        Schema::create('districts', function (Blueprint $table) {
            $table->uuid('id')->index()->primary();
            $table->string('name', 50);
            $table->string('old_id');
            $table->foreignUuid('regency_id')
                ->constrained('regencies')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });

        Schema::create('villages', function (Blueprint $table) {
            $table->uuid('id')->primary()->index();
            $table->string('name', 50);
            $table->foreignUuid('district_id')
                ->constrained('districts')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('provinces');
        Schema::dropIfExists('regencies');
        Schema::dropIfExists('districts');
        Schema::dropIfExists('villages');
    }
};
