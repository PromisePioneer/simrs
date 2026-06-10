<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ================================================================
        // E-PRESCRIPTION (E-RESEP)
        // ================================================================
        Schema::create('pharmacy_eprescriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('prescription_number')->unique();

            // Sumber resep
            $table->enum('prescription_source', [
                'emr_outpatient',  // Dari EMR rawat jalan
                'emr_inpatient',   // Dari EMR rawat inap
                'emr_igd',         // Dari EMR IGD
                'manual',          // Input manual apoteker
            ])->index();

            // Referensi ke kunjungan
            $table->uuid('visit_id')->nullable()->index();      // outpatient_visit_id
            $table->uuid('admission_id')->nullable()->index();  // inpatient_admission_id
            $table->string('visit_reference')->nullable();

            // Pasien & Dokter
            $table->uuid('patient_id')->index();
            $table->string('patient_name');
            $table->string('patient_mrn');
            $table->uuid('doctor_id')->index();
            $table->string('doctor_name');
            $table->string('doctor_sip')->nullable();

            // Diagnosa
            $table->string('diagnosis_code')->nullable();
            $table->string('diagnosis_name')->nullable();

            // Status workflow: pending → reviewing → reviewed → verified → dispensed
            $table->enum('status', [
                'pending',       // Menunggu telaah
                'reviewing',     // Sedang ditelaah
                'reviewed',      // Sudah ditelaah, menunggu verifikasi
                'verified',      // Diverifikasi apoteker
                'dispensing',    // Sedang disiapkan
                'dispensed',     // Sudah diserahkan ke pasien
                'cancelled',     // Dibatalkan
                'on_hold',       // Ditahan (perlu konfirmasi dokter)
            ])->default('pending')->index();

            // Prioritas: routine, urgent, stat
            $table->enum('priority', ['routine', 'urgent', 'stat'])->default('routine');

            // Timestamps workflow
            $table->timestamp('prescribed_at');
            $table->uuid('reviewed_by')->nullable()->index();
            $table->timestamp('reviewed_at')->nullable();
            $table->uuid('verified_by')->nullable()->index();
            $table->timestamp('verified_at')->nullable();
            $table->uuid('dispensed_by')->nullable()->index();
            $table->timestamp('dispensed_at')->nullable();

            // Catatan & Notes
            $table->text('doctor_notes')->nullable();
            $table->text('pharmacist_notes')->nullable();
            $table->text('hold_reason')->nullable();

            $table->uuid('created_by')->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'prescribed_at']);
            $table->index(['patient_id', 'status']);
        });

        Schema::create('pharmacy_eprescription_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('prescription_id')->index();
            $table->uuid('medicine_id')->index();
            $table->string('medicine_name');

            // Aturan pakai
            $table->decimal('dose', 8, 3);                    // Dosis per pemberian
            $table->string('dose_unit');                       // mg, ml, tablet, dll
            $table->integer('frequency_per_day');              // Berapa kali sehari
            $table->integer('duration_days');                  // Berapa hari
            $table->integer('total_quantity');                 // Total qty yang disiapkan
            $table->string('route_of_administration');         // oral, iv, im, topical
            $table->string('dosage_instruction');              // "3x1 sesudah makan"

            // Racikan flag
            $table->boolean('is_compounding')->default(false);
            $table->uuid('compounding_formula_id')->nullable()->index();

            // Status dispening per item
            $table->enum('dispensing_status', [
                'pending', 'dispensed', 'substituted', 'not_available', 'cancelled'
            ])->default('pending');

            $table->uuid('substituted_medicine_id')->nullable();
            $table->string('substitution_reason')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('prescription_id')
                ->references('id')
                ->on('pharmacy_eprescriptions')
                ->onDelete('cascade');
        });

        // ================================================================
        // PRESCRIPTION REVIEW (TELAAH RESEP)
        // ================================================================
        Schema::create('pharmacy_prescription_reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('prescription_id')->index();

            $table->enum('review_type', [
                'administrative', // Kelengkapan administrasi
                'pharmaceutical', // Aspek farmasetik (dosis, stabilitas, dll)
                'clinical',       // Aspek klinis (interaksi, kontraindikasi, dll)
            ])->index();

            $table->enum('result', [
                'pass',           // Lulus telaah
                'pass_with_notes',// Lulus dengan catatan
                'requires_clarification', // Perlu konfirmasi ke dokter
                'rejected',       // Ditolak
            ])->index();

            // Checklist telaah
            $table->json('checklist_results')->nullable();

            // Temuan klinis
            $table->json('drug_interactions')->nullable();     // Interaksi obat ditemukan
            $table->json('contraindications')->nullable();    // Kontraindikasi
            $table->json('allergy_alerts')->nullable();        // Alert alergi
            $table->boolean('duplicate_therapy')->default(false);
            $table->text('review_notes')->nullable();

            $table->uuid('reviewed_by')->index();
            $table->timestamp('reviewed_at');

            $table->timestamps();

            $table->foreign('prescription_id')
                ->references('id')
                ->on('pharmacy_eprescriptions')
                ->onDelete('cascade');
        });

        // ================================================================
        // COMPOUNDING FORMULAS (RESEP RACIKAN)
        // ================================================================
        Schema::create('pharmacy_compounding_formulas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('formula_name');
            $table->string('formula_code')->nullable()->unique();
            $table->enum('formula_type', [
                'puyer',      // Serbuk/puyer
                'kapsul',     // Kapsul racikan
                'krim',       // Krim/salep
                'sirup',      // Sirup racikan
                'suppositoria',
                'other',
            ])->index();

            $table->integer('yield_quantity');    // Jumlah yang dihasilkan
            $table->string('yield_unit');          // Contoh: "bungkus", "kapsul"

            // Biaya racikan
            $table->decimal('compounding_fee', 12, 2)->default(0);  // Jasa racik
            $table->decimal('packaging_fee', 12, 2)->default(0);    // Embalase/kemasan

            $table->boolean('is_active')->default(true);
            $table->text('instructions')->nullable();
            $table->text('notes')->nullable();

            $table->uuid('created_by')->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['tenant_id', 'formula_type']);
            $table->index(['tenant_id', 'is_active']);
        });

        Schema::create('pharmacy_compounding_formula_components', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('formula_id')->index();
            $table->uuid('medicine_id')->index();
            $table->string('medicine_name');
            $table->decimal('quantity_per_yield', 10, 4);  // Qty per 1 yield
            $table->string('unit');                          // satuan (mg, ml, tab)
            $table->integer('sort_order')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('formula_id')
                ->references('id')
                ->on('pharmacy_compounding_formulas')
                ->onDelete('cascade');
        });

        // ================================================================
        // COMPOUNDING BATCHES - Realisasi racikan per resep
        // ================================================================
        Schema::create('pharmacy_compounding_batches', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('prescription_id')->index();
            $table->uuid('prescription_item_id')->index();
            $table->uuid('formula_id')->nullable()->index();

            $table->integer('quantity_to_make');    // Berapa yang dibuat
            $table->string('batch_reference');       // Nomor batch racikan internal

            $table->enum('status', ['pending', 'in_progress', 'completed', 'cancelled'])
                ->default('pending');

            // Biaya racikan
            $table->decimal('component_cost', 12, 2)->default(0);
            $table->decimal('compounding_fee', 12, 2)->default(0);
            $table->decimal('packaging_fee', 12, 2)->default(0);
            $table->decimal('total_cost', 12, 2)->default(0);

            $table->uuid('prepared_by')->nullable()->index();
            $table->uuid('verified_by')->nullable()->index();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();

            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('prescription_id')
                ->references('id')
                ->on('pharmacy_eprescriptions')
                ->onDelete('cascade');
        });

        Schema::create('pharmacy_compounding_batch_components', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('batch_id')->index();
            $table->uuid('medicine_id')->index();
            $table->string('batch_number')->nullable();
            $table->decimal('quantity_used', 10, 4);
            $table->string('unit');
            $table->decimal('unit_cost', 12, 2)->default(0);
            $table->decimal('total_cost', 12, 2)->default(0);
            $table->timestamps();

            $table->foreign('batch_id')
                ->references('id')
                ->on('pharmacy_compounding_batches')
                ->onDelete('cascade');
        });

        // ================================================================
        // LABEL TEMPLATES (MASTER ATURAN PAKAI & ETIKET)
        // ================================================================
        Schema::create('pharmacy_label_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->string('template_name');
            $table->enum('template_type', [
                'outer',           // Etiket luar (aturan pakai)
                'inner',           // Etiket dalam
                'high_alert',      // Label High Alert
                'compounding',     // Label racikan
                'injectable',      // Label injeksi
            ])->default('outer');

            // Konten template (bisa mengandung variabel: {{patient_name}}, {{dose}}, dll)
            $table->text('header_text')->nullable();
            $table->text('body_template');             // Template utama
            $table->text('footer_text')->nullable();
            $table->text('warning_text')->nullable();  // Peringatan khusus

            // Format etiket
            $table->enum('paper_size', ['58mm', '80mm', 'a5', 'a4'])->default('58mm');
            $table->integer('font_size')->default(10);
            $table->boolean('show_barcode')->default(false);
            $table->boolean('show_qr_code')->default(false);
            $table->boolean('show_logo')->default(false);

            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->uuid('created_by')->index();
            $table->timestamps();

            $table->index(['tenant_id', 'template_type']);
            $table->index(['tenant_id', 'is_default']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pharmacy_label_templates');
        Schema::dropIfExists('pharmacy_compounding_batch_components');
        Schema::dropIfExists('pharmacy_compounding_batches');
        Schema::dropIfExists('pharmacy_compounding_formula_components');
        Schema::dropIfExists('pharmacy_compounding_formulas');
        Schema::dropIfExists('pharmacy_prescription_reviews');
        Schema::dropIfExists('pharmacy_eprescription_items');
        Schema::dropIfExists('pharmacy_eprescriptions');
    }
};
