<?php

declare(strict_types=1);

namespace Domains\Clinical\Application\Services;

use Domains\Billing\Application\Services\OutpatientBillService;
use Domains\Clinical\Domain\Repository\PrescriptionRepositoryInterface;
use Domains\Outpatient\Domain\Repository\OutpatientVisitRepositoryInterface;
use Domains\Outpatient\Domain\Repository\QueueRepositoryInterface;
use Illuminate\Support\Facades\DB;

/**
 * Service: SOAP (Subjective, Objective, Assessment, Plan) untuk rawat jalan.
 *
 * Mengorkestrasi:
 * 1. Diagnosa (ICD-10)
 * 2. Prosedur (ICD-9)
 * 3. Resep obat
 * 4. Update status kunjungan + antrian → completed
 * 5. Auto-generate draft tagihan
 */
final readonly class DiagnoseService
{
    public function __construct(
        private OutpatientVisitRepositoryInterface $visitRepo,
        private QueueRepositoryInterface           $queueRepo,
        private PrescriptionRepositoryInterface    $prescriptionRepo,
        private OutpatientBillService              $billService,
    )
    {
    }

    /**
     * Simpan semua SOAP data sekaligus dalam satu transaksi.
     */
    public function appendSoap(array $data, string $visitId): object
    {
        return DB::transaction(function () use ($data, $visitId) {
            $visit = $this->visitRepo->findById($visitId);

            // 1. Update status visit + queue → completed
            $this->visitRepo->changeStatus($visitId, 'completed');
            $this->queueRepo->changeStatusBasedOnVisitId($visitId, 'completed');

            // 2. Simpan diagnosa
            if (!empty($data['diagnoses'])) {
                $diagnoses = collect($data['diagnoses'])->map(fn($d) => [
                    'tenant_id' => $visit->tenant_id,
                    'icd10_code' => $d['icd10_code'],
                    'description' => $d['description'],
                    'type' => $d['type'],
                    'is_confirmed' => true,
                ])->toArray();

                $this->visitRepo->appendDiagnoses($visitId, $diagnoses);
            }

            // 3. Simpan prosedur
            if (!empty($data['procedures'])) {
                $procedures = collect($data['procedures'])
                    ->filter(fn($p) => !empty($p['icd9_code']))
                    ->map(fn($p) => [
                        'tenant_id' => $visit->tenant_id,
                        'icd9_code' => $p['icd9_code'],
                        'name' => $p['name'],
                        'description' => $p['description'] ?? '',
                        'performed_by' => auth()->id(),
                        'procedure_date' => now(),
                        'notes' => $p['notes'] ?? null,
                    ])->toArray();

                if (!empty($procedures)) {
                    $this->visitRepo->appendProcedures($visitId, $procedures);
                }
            }

            // 4. Simpan resep (validasi stok, belum dikurangi)
            if (!empty($data['prescriptions'])) {
                $this->prescriptionRepo->storeForVisit($visit, $data['prescriptions']);
            }

            // 5. Auto-generate draft tagihan
            $this->billService->createDraftFromVisit($visit);

            return $this->visitRepo->findById($visitId);
        }, 3);
    }
}
