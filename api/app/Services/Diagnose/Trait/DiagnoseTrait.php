<?php

namespace App\Services\Diagnose\Trait;

trait DiagnoseTrait
{
    public function appendDiagnose(string $visitId, array $data, object $visit): void
    {
        if (!empty($data['diagnoses'])) {

            $collection = collect($data['diagnoses'])->map(function ($item) use ($visit) {
                return [
                    'tenant_id' => $visit->tenant_id,
                    'icd10_code' => $item['icd_code'],
                    'description' => $item['description'],
                    'type' => $item['type'],
                    'is_confirmed' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();


            $this->outPatientVisitRepository->appendDiagnoses(
                id: $visitId, diagnoses: $collection
            );
        }

    }


    public function appendProcedure(string $visitId, array $data, object $visit): void
    {
        if (!empty($data['procedures'])) {

            $procedures = collect($data['procedures'])
                ->filter(fn($p) => !empty($p['code']))
                ->map(function ($item) use ($visit) {
                    return [
                        'tenant_id' => $visit->tenant_id,
                        'icd9_code' => $item['code'],
                        'description' => $item['description'] ?? '',
                        'performed_by' => auth()->id(),
                        'procedure_date' => now(),
                        'notes' => $item['notes'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })
                ->toArray();

            if (!empty($procedures)) {
                $this->outPatientVisitRepository
                    ->appendProcedures($visitId, $procedures);
            }
        }
    }


    public function appendPrescription(string $visitId, array $data, object $visit): void
    {

        if (!empty($data['prescriptions'])) {

            $prescriptions = collect($data['prescriptions'])
                ->filter(fn($p) => !empty($p['medicine_id']))
                ->map(function ($item) use ($visit) {
                    return [
                        'tenant_id' => $visit->tenant_id,
                        'medicine_id' => $item['medicine_id'],
                        'dosage' => $item['dosage'],
                        'frequency' => $item['frequency'],
                        'duration' => $item['duration'] ?? null,
                        'route' => $item['route'] ?? null,
                        'quantity' => $item['quantity'] ?? null,
                        'notes' => $item['notes'] ?? null,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })
                ->toArray();

            if (!empty($prescriptions)) {
                $this->outPatientVisitRepository
                    ->appendPrescriptions($visitId, $prescriptions);
            }
        }
    }
}
