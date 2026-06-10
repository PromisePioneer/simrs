<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyEPrescription;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyEPrescriptionItem;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyPrescriptionReview;
use Illuminate\Support\Str;

/**
 * PharmacyPrescriptionReviewService
 *
 * Telaah resep 3 level: administratif, farmasetik, klinis.
 * Hasil telaah menentukan apakah resep bisa diproses atau perlu konfirmasi.
 */
class PharmacyPrescriptionReviewService
{
    /**
     * Buat e-resep baru (bisa dari EMR atau manual)
     */
    public function createPrescription(string $tenantId, array $data): array
    {
        $prescription = PharmacyEPrescription::create([
            'id' => Str::uuid(),
            'tenant_id' => $tenantId,
            'prescription_number' => $this->generatePrescriptionNumber($tenantId),
            'prescription_source' => $data['prescription_source'],
            'visit_id' => $data['visit_id'] ?? null,
            'admission_id' => $data['admission_id'] ?? null,
            'visit_reference' => $data['visit_reference'] ?? null,
            'patient_id' => $data['patient_id'],
            'patient_name' => $data['patient_name'],
            'patient_mrn' => $data['patient_mrn'],
            'doctor_id' => $data['doctor_id'],
            'doctor_name' => $data['doctor_name'],
            'doctor_sip' => $data['doctor_sip'] ?? null,
            'diagnosis_code' => $data['diagnosis_code'] ?? null,
            'diagnosis_name' => $data['diagnosis_name'] ?? null,
            'status' => 'pending',
            'priority' => $data['priority'] ?? 'routine',
            'prescribed_at' => $data['prescribed_at'] ?? now(),
            'doctor_notes' => $data['doctor_notes'] ?? null,
            'created_by' => auth()->id(),
        ]);

        // Tambah item obat
        foreach ($data['items'] ?? [] as $item) {
            PharmacyEPrescriptionItem::create([
                'id' => Str::uuid(),
                'prescription_id' => $prescription->id,
                'medicine_id' => $item['medicine_id'],
                'medicine_name' => $item['medicine_name'],
                'dose' => $item['dose'],
                'dose_unit' => $item['dose_unit'],
                'frequency_per_day' => $item['frequency_per_day'],
                'duration_days' => $item['duration_days'],
                'total_quantity' => $item['total_quantity'],
                'route_of_administration' => $item['route_of_administration'],
                'dosage_instruction' => $item['dosage_instruction'],
                'is_compounding' => $item['is_compounding'] ?? false,
                'compounding_formula_id' => $item['compounding_formula_id'] ?? null,
                'notes' => $item['notes'] ?? null,
            ]);
        }

        return [
            'status' => 'success',
            'prescription_id' => $prescription->id,
            'prescription_number' => $prescription->prescription_number,
        ];
    }

    /**
     * Telaah administratif: kelengkapan data resep
     */
    public function reviewAdministrative(string $prescriptionId, array $checklistResults, string $notes = null): array
    {
        $prescription = PharmacyEPrescription::with('items')->findOrFail($prescriptionId);

        // Cek kelengkapan otomatis
        $issues = [];
        if (empty($prescription->doctor_sip)) $issues[] = 'SIP dokter tidak tercantum';
        if ($prescription->items->isEmpty()) $issues[] = 'Resep tidak memiliki item obat';
        if (empty($prescription->diagnosis_code)) $issues[] = 'Kode diagnosa tidak ada';

        $result = empty($issues) && ($checklistResults['all_passed'] ?? true) ? 'pass' : 'pass_with_notes';
        if (!empty($issues)) {
            $notes = implode('; ', $issues) . ($notes ? '; ' . $notes : '');
        }

        return $this->saveReview($prescriptionId, 'administrative', $result, $checklistResults, [], [], [], false, $notes);
    }

    /**
     * Telaah farmasetik: dosis, bentuk sediaan, stabilitas
     */
    public function reviewPharmaceutical(string $prescriptionId, array $data): array
    {
        $prescription = PharmacyEPrescription::with('items.medicine')->findOrFail($prescriptionId);

        $issues = [];
        // Validasi dosis dasar (bisa diperluas dengan drug database)
        foreach ($prescription->items as $item) {
            if ($item->dose <= 0) {
                $issues[] = "Dosis tidak valid untuk: {$item->medicine_name}";
            }
            if ($item->total_quantity <= 0) {
                $issues[] = "Jumlah tidak valid untuk: {$item->medicine_name}";
            }
        }

        $result = empty($issues) ? 'pass' : 'requires_clarification';

        return $this->saveReview(
            $prescriptionId, 'pharmaceutical', $result,
            $data['checklist_results'] ?? [],
            [], [], [], false,
            !empty($issues) ? implode('; ', $issues) : ($data['notes'] ?? null)
        );
    }

    /**
     * Telaah klinis: interaksi obat, kontraindikasi, alergi
     */
    public function reviewClinical(string $prescriptionId, array $data): array
    {
        $drugInteractions = $data['drug_interactions'] ?? [];
        $contraindications = $data['contraindications'] ?? [];
        $allergyAlerts = $data['allergy_alerts'] ?? [];
        $duplicateTherapy = $data['duplicate_therapy'] ?? false;

        $hasIssues = !empty($drugInteractions) || !empty($contraindications)
            || !empty($allergyAlerts) || $duplicateTherapy;

        $result = $hasIssues ? 'requires_clarification' : 'pass';

        $review = $this->saveReview(
            $prescriptionId, 'clinical', $result,
            $data['checklist_results'] ?? [],
            $drugInteractions, $contraindications, $allergyAlerts,
            $duplicateTherapy, $data['notes'] ?? null
        );

        // Jika ada masalah, tahan resep untuk konfirmasi dokter
        if ($hasIssues) {
            PharmacyEPrescription::where('id', $prescriptionId)
                ->update(['status' => 'on_hold', 'hold_reason' => 'Perlu klarifikasi klinis']);
        }

        return $review;
    }

    /**
     * Verifikasi akhir oleh apoteker (setelah semua telaah pass)
     */
    public function verifyPrescription(string $prescriptionId, ?string $notes = null): array
    {
        $prescription = PharmacyEPrescription::with('reviews')->findOrFail($prescriptionId);

        if (!$prescription->isFullyReviewed()) {
            return [
                'status' => 'error',
                'message' => 'Telaah resep belum lengkap (administratif, farmasetik, klinis)',
            ];
        }

        $failedReviews = $prescription->reviews->whereIn('result', ['rejected', 'requires_clarification']);
        if ($failedReviews->isNotEmpty()) {
            return [
                'status' => 'error',
                'message' => 'Ada temuan telaah yang belum diselesaikan: ' . $failedReviews->pluck('review_type')->implode(', '),
            ];
        }

        $prescription->update([
            'status' => 'verified',
            'verified_by' => auth()->id(),
            'verified_at' => now(),
            'pharmacist_notes' => $notes,
        ]);

        return ['status' => 'success', 'prescription_id' => $prescriptionId];
    }

    /**
     * Daftar resep pending telaah
     */
    public function getPendingReviews(string $tenantId, ?string $status = null): array
    {
        $query = PharmacyEPrescription::byTenant($tenantId)
            ->with(['items', 'reviews'])
            ->orderBy('priority', 'asc') // stat dulu
            ->orderBy('prescribed_at', 'asc');

        if ($status) {
            $query->byStatus($status);
        } else {
            $query->whereIn('status', ['pending', 'reviewing', 'on_hold']);
        }

        return $query->paginate(20)->toArray();
    }

    private function saveReview(
        string $prescriptionId,
        string $reviewType,
        string $result,
        array $checklistResults,
        array $drugInteractions,
        array $contraindications,
        array $allergyAlerts,
        bool $duplicateTherapy,
        ?string $notes
    ): array {
        // Hapus telaah lama dari tipe yang sama jika ada
        PharmacyPrescriptionReview::where('prescription_id', $prescriptionId)
            ->where('review_type', $reviewType)
            ->delete();

        $review = PharmacyPrescriptionReview::create([
            'id' => Str::uuid(),
            'prescription_id' => $prescriptionId,
            'review_type' => $reviewType,
            'result' => $result,
            'checklist_results' => $checklistResults,
            'drug_interactions' => $drugInteractions,
            'contraindications' => $contraindications,
            'allergy_alerts' => $allergyAlerts,
            'duplicate_therapy' => $duplicateTherapy,
            'review_notes' => $notes,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        // Update status resep
        PharmacyEPrescription::where('id', $prescriptionId)
            ->whereIn('status', ['pending', 'reviewing'])
            ->update(['status' => 'reviewing']);

        return [
            'status' => 'success',
            'review_id' => $review->id,
            'result' => $result,
            'has_issues' => $review->hasIssues(),
        ];
    }

    private function generatePrescriptionNumber(string $tenantId): string
    {
        $prefix = 'RX-' . date('Ymd');
        $count = PharmacyEPrescription::where('tenant_id', $tenantId)
            ->where('prescription_number', 'like', $prefix . '%')
            ->count();
        return $prefix . '-' . str_pad((string)($count + 1), 5, '0', STR_PAD_LEFT);
    }
}
