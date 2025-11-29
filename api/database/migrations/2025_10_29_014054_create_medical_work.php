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
        Schema::create('professions', function (Blueprint $table) {
            $table->uuid('id')->primary()->index();
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('specializations', function (Blueprint $table) {
            $table->uuid('id')->primary()->index();
            $table->foreignUuid('profession_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });


        Schema::create('sub_specializations', function (Blueprint $table) {
            $table->uuid('id')->primary()->index();
            $table->foreignUuid('specialization_id')->constrained('specializations')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professions');
        Schema::dropIfExists('specializations');
        Schema::dropIfExists('sub_specializations');
    }
};
