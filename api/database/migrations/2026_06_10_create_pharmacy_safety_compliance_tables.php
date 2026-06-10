<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ================================================================
        // BATCH DISTRIBUTION - tracing obat ke pasien per batch/lot
        // ================================================================
        Schema::create('pharmacy_batch_distributions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('medicine_id')->index();
            $table->string('batch_number')->index();
            $table->date('expiry_date');
            $table->uuid('warehouse_id')->index();

            // Sumber distribusi
            $table->enum('distribution_type', [
                'prescription_sale',   // Resep rawat jalan/inap
                'otc_sale',            // Penjualan bebas
                'inpatient_dispensing',// Pemberian rawat inap
                'stock_transfer',      // Transfer antar gudang
                'compounding',         // Bahan racikan
            ])->index();

            // Referensi transaksi sumber
            $table->uuid('reference_id')->index();   // sale_id / transfer_id / etc
            $table->string('reference_number');       // nomor transaksi

            // Penerima
            $table->uuid('patient_id')->nullable()->index();
            $table->string('patient_name')->nullable();
            $table->string('patient_mrn')->nullable();

            $table->integer('quantity_distributed');
            $table->decimal('unit_price', 15, 2)->default(0);

            $table->uuid('distributed_by')->index();
            $table->timestamp('distributed_at');

            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'batch_number']);
            $table->index(['medicine_id', 'batch_number']);
            $table->index(['tenant_id', 'distributed_at']);
        });

        // ================================================================
        // RECALL LOGS - recall BPOM / internal
        // ================================================================
        Schema::create('pharmacy_recall_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('recall_number')->unique();

            $table->uuid('medicine_id')->index();
            $table->string('batch_number')->nullable()->index(); // null = semua batch
            $table->date('expiry_date')->nullable();

            $table->enum('recall_type', [
                'bpom_mandatory',   // Recall wajib dari BPOM
                'manufacturer',     // Recall dari produsen/distributor
                'internal',         // Inisiatif internal RS
            ])->index();

            $table->enum('recall_class', [
                'class_i',   // Risiko serius / mengancam jiwa
                'class_ii',  // Risiko menengah
                'class_iii', // Risiko rendah
            ])->default('class_ii');

            $table->string('recall_reason');
            $table->text('recall_detail')->nullable();
            $table->text('action_required')->nullable();

            // Status workflow
            $table->enum('status', [
                'initiated',    // Mulai dibuat
                'notified',     // Sudah notifikasi ke unit
                'in_progress',  // Sedang proses tarik
                'completed',    // Selesai
                'cancelled',    // Dibatalkan
            ])->default('initiated')->index();

            // BPOM reference
            $table->string('bpom_recall_number')->nullable();
            $table->date('bpom_notification_date')->nullable();
            $table->date('recall_deadline')->nullable();

            // Audit
            $table->uuid('initiated_by')->index();
            $table->uuid('completed_by')->nullable()->index();
            $table->timestamp('initiated_at');
            $table->timestamp('completed_at')->nullable();
            $table->text('completion_notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'status']);
            $table->index(['medicine_id', 'status']);
        });

        // ================================================================
        // RECALL IMPACTS - dampak recall per distribusi
        // ================================================================
        Schema::create('pharmacy_recall_impacts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('recall_id')->index();
            $table->uuid('distribution_id')->index(); // FK ke batch_distributions

            $table->uuid('medicine_id')->index();
            $table->string('batch_number');
            $table->uuid('patient_id')->nullable()->index();
            $table->string('patient_name')->nullable();
            $table->string('patient_mrn')->nullable();
            $table->integer('quantity_distributed');
            $table->integer('quantity_recovered')->default(0);

            $table->enum('status', [
                'identified',       // Teridentifikasi
                'patient_notified', // Pasien sudah dihubungi
                'recovered',        // Obat berhasil ditarik
                'not_recoverable',  // Tidak bisa ditarik (sudah dikonsumsi)
                'pending',          // Menunggu tindak lanjut
            ])->default('identified')->index();

            $table->text('notes')->nullable();
            $table->uuid('handled_by')->nullable()->index();
            $table->timestamp('handled_at')->nullable();

            $table->timestamps();

            $table->foreign('recall_id')
                ->references('id')
                ->on('pharmacy_recall_logs')
                ->onDelete('cascade');
        });

        // ================================================================
        // HIGH ALERT CLASSIFICATION
        // ================================================================
        Schema::create('pharmacy_high_alert_classifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('medicine_id')->unique()->index();

            $table->enum('alert_level', [
                'high_alert',       // High Alert Drug
                'narcotics',        // Narkotika
                'psychotropics',    // Psikotropika
                'precursor',        // Prekursor
                'cytotoxic',        // Sitostatika
                'look_alike',       // LASA - Look Alike
                'sound_alike',      // LASA - Sound Alike
                'electrolyte_concentrate', // Elektrolit konsentrasi tinggi
            ])->index();

            $table->string('warning_label')->nullable(); // Label peringatan
            $table->string('storage_requirement')->nullable(); // Persyaratan penyimpanan khusus
            $table->text('dispensing_precaution')->nullable(); // Tindak pencegahan saat dispensing
            $table->boolean('double_check_required')->default(true);
            $table->boolean('requires_special_storage')->default(false);
            $table->string('visual_alert_color')->default('#FF0000'); // Warna visual

            $table->boolean('is_active')->default(true);
            $table->uuid('classified_by')->index();
            $table->uuid('updated_by')->nullable()->index();

            $table->timestamps();

            $table->index(['tenant_id', 'alert_level']);
            $table->index(['tenant_id', 'is_active']);
        });

        // ================================================================
        // LASA CLASSIFICATION - Look Alike Sound Alike
        // ================================================================
        Schema::create('pharmacy_lasa_classifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();

            // Pasangan obat LASA
            $table->uuid('medicine_a_id')->index();
            $table->uuid('medicine_b_id')->index();

            $table->enum('lasa_type', [
                'look_alike',   // Tampak mirip (kemasan/bentuk)
                'sound_alike',  // Bunyi mirip (nama)
                'both',         // Keduanya
            ])->index();

            $table->string('similarity_reason')->nullable(); // Alasan kesamaan
            $table->boolean('requires_tall_man_lettering')->default(false);
            $table->string('tall_man_lettering_a')->nullable(); // Contoh: "vALIum"
            $table->string('tall_man_lettering_b')->nullable();

            $table->boolean('is_active')->default(true);
            $table->uuid('classified_by')->index();

            $table->timestamps();

            $table->unique(['tenant_id', 'medicine_a_id', 'medicine_b_id']);
            $table->index(['tenant_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_lasa_classifications');
        Schema::dropIfExists('pharmacy_high_alert_classifications');
        Schema::dropIfExists('pharmacy_recall_impacts');
        Schema::dropIfExists('pharmacy_recall_logs');
        Schema::dropIfExists('pharmacy_batch_distributions');
    }
};
