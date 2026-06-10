<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyKFAMapping;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySatuSehatMapping;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyExternalSyncLog;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class SatuSehatPharmacyIntegrationService
{
    protected $satuSehatBaseUrl = 'https://api.satusehat.kemkes.go.id';
    protected $satuSehatApiKey;

    public function __construct()
    {
        $this->satuSehatApiKey = config('pharmacy.satusehat_api_key');
    }

    /**
     * Sync medicines with SatuSehat KFA (Kamus Farmasi dan Alat Kesehatan)
     */
    public function syncMedicinesToSatuSehat(string $tenantId): array
    {
        $syncLog = PharmacyExternalSyncLog::create([
            'tenant_id' => $tenantId,
            'external_system' => 'satusehat',
            'sync_type' => 'medicine_data',
            'initiated_by' => auth()->id(),
            'started_at' => now(),
            'sync_status' => 'pending',
        ]);

        try {
            $medicines = MedicineModel::where('tenant_id', $tenantId)
                ->where('is_for_sell', true)
                ->get();

            $syncedCount = 0;
            $failedCount = 0;
            $errors = [];

            foreach ($medicines as $medicine) {
                try {
                    $this->mapMedicineToKFA($medicine, $tenantId);
                    $syncedCount++;
                } catch (\Exception $e) {
                    $failedCount++;
                    $errors[] = [
                        'medicine_id' => $medicine->id,
                        'error' => $e->getMessage(),
                    ];
                }
            }

            $syncLog->update([
                'sync_status' => $failedCount === 0 ? 'success' : 'partial',
                'records_synced' => $syncedCount,
                'records_failed' => $failedCount,
                'response_data' => json_encode(['errors' => $errors]),
                'completed_at' => now(),
            ]);

            return [
                'status' => $failedCount === 0 ? 'success' : 'partial',
                'synced' => $syncedCount,
                'failed' => $failedCount,
                'errors' => $errors,
            ];
        } catch (\Exception $e) {
            $syncLog->update([
                'sync_status' => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            throw $e;
        }
    }

    /**
     * Map individual medicine to KFA
     */
    public function mapMedicineToKFA(MedicineModel $medicine, string $tenantId): PharmacySatuSehatMapping
    {
        // Search KFA database for matching medicine
        $kfaData = $this->searchKFADatabase($medicine);

        if (!$kfaData) {
            throw new \Exception("Tidak menemukan data KFA untuk obat: {$medicine->name}");
        }

        // Create or update mapping
        $mapping = PharmacySatuSehatMapping::updateOrCreate(
            ['medicine_id' => $medicine->id],
            [
                'tenant_id' => $tenantId,
                'satusehat_code' => $kfaData['code'],
                'satusehat_name' => $kfaData['name'],
                'satusehat_unit' => $kfaData['unit'],
                'satusehat_form' => $kfaData['form'],
                'satusehat_strength' => $kfaData['strength'] ?? null,
                'is_narcotics' => $kfaData['is_narcotics'] ?? false,
                'is_psychotropics' => $kfaData['is_psychotropics'] ?? false,
                'is_precursor' => $kfaData['is_precursor'] ?? false,
                'last_validated_at' => now(),
                'is_valid' => true,
            ]
        );

        return $mapping;
    }

    /**
     * Validate KFA compliance for medicine
     */
    public function validateKFACompliance(string $medicineId): array
    {
        $medicine = MedicineModel::findOrFail($medicineId);
        $mapping = PharmacySatuSehatMapping::where('medicine_id', $medicineId)->first();

        $validationErrors = [];

        if (!$mapping) {
            $validationErrors[] = 'Obat tidak terpetakan ke KFA SatuSehat';
        } else {
            // Validate name match
            if (strtolower($medicine->name) !== strtolower($mapping->satusehat_name)) {
                $validationErrors[] = "Nama obat tidak sesuai dengan KFA: {$mapping->satusehat_name}";
            }

            // Validate strength if applicable
            if ($medicine->strength && $mapping->satusehat_strength) {
                if (strtolower($medicine->strength) !== strtolower($mapping->satusehat_strength)) {
                    $validationErrors[] = "Kekuatan obat tidak sesuai dengan KFA";
                }
            }
        }

        // Update validation status
        if ($mapping) {
            $mapping->update([
                'is_valid' => empty($validationErrors),
                'validation_errors' => json_encode($validationErrors),
                'last_validated_at' => now(),
            ]);
        }

        return [
            'medicine_id' => $medicineId,
            'is_compliant' => empty($validationErrors),
            'validation_errors' => $validationErrors,
        ];
    }

    /**
     * Sync usage report to SatuSehat
     */
    public function syncUsageReportToSatuSehat(string $tenantId, string $reportDate): array
    {
        $syncLog = PharmacyExternalSyncLog::create([
            'tenant_id' => $tenantId,
            'external_system' => 'satusehat',
            'sync_type' => 'usage_report',
            'initiated_by' => auth()->id(),
            'started_at' => now(),
            'sync_status' => 'pending',
        ]);

        try {
            $usageReports = DB::table('pharmacy_usage_reports')
                ->where('tenant_id', $tenantId)
                ->where('report_date', $reportDate)
                ->get();

            $reportData = [];

            foreach ($usageReports as $report) {
                $mapping = PharmacySatuSehatMapping::where('medicine_id', $report->medicine_id)->first();

                if ($mapping && $mapping->is_valid) {
                    $reportData[] = [
                        'kfa_code' => $mapping->satusehat_code,
                        'kfa_name' => $mapping->satusehat_name,
                        'quantity_sold' => $report->total_units_sold,
                        'report_date' => $reportDate,
                    ];
                }
            }

            // Send to SatuSehat API
            $response = $this->sendToSatuSehatAPI('/pharmacy/usage-report', $reportData);

            $syncLog->update([
                'request_data' => json_encode(['report_count' => count($reportData), 'date' => $reportDate]),
                'response_data' => json_encode($response),
                'sync_status' => 'success',
                'records_synced' => count($reportData),
                'completed_at' => now(),
            ]);

            return ['status' => 'success', 'records' => count($reportData)];
        } catch (\Exception $e) {
            $syncLog->update([
                'sync_status' => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            throw $e;
        }
    }

    /**
     * Sync narcotics report to government (Dinkes, BPOM)
     */
    public function syncNarcoticsReportToGovernment(string $tenantId, string $reportPeriod, string $agency = 'dinkes'): array
    {
        $syncLog = PharmacyExternalSyncLog::create([
            'tenant_id' => $tenantId,
            'external_system' => $agency,
            'sync_type' => 'narcotics_report',
            'initiated_by' => auth()->id(),
            'started_at' => now(),
            'sync_status' => 'pending',
        ]);

        try {
            $narcoticsReports = DB::table('pharmacy_narcotics_reports')
                ->where('tenant_id', $tenantId)
                ->where('report_period', $reportPeriod)
                ->get();

            $reportData = [];

            foreach ($narcoticsReports as $report) {
                $mapping = PharmacySatuSehatMapping::where('medicine_id', $report->medicine_id)->first();

                if ($mapping && $mapping->is_narcotics) {
                    $reportData[] = [
                        'kfa_code' => $mapping->satusehat_code,
                        'medicine_name' => $mapping->satusehat_name,
                        'opening_stock' => $report->opening_stock,
                        'received' => $report->quantity_received,
                        'dispensed' => $report->quantity_dispensed,
                        'returned' => $report->quantity_returned,
                        'destroyed' => $report->quantity_destroyed,
                        'closing_stock' => $report->closing_stock,
                        'report_period' => $reportPeriod,
                    ];
                }
            }

            // Send to government API
            $endpoint = $agency === 'dinkes' ? '/government/narcotics-report' : '/government/bpom-narcotics';
            $response = $this->sendToGovernmentAPI($endpoint, $reportData);

            $syncLog->update([
                'request_data' => json_encode(['report_count' => count($reportData), 'agency' => $agency]),
                'response_data' => json_encode($response),
                'sync_status' => 'success',
                'records_synced' => count($reportData),
                'completed_at' => now(),
            ]);

            return ['status' => 'success', 'records' => count($reportData), 'agency' => $agency];
        } catch (\Exception $e) {
            $syncLog->update([
                'sync_status' => 'failed',
                'error_message' => $e->getMessage(),
                'completed_at' => now(),
            ]);

            throw $e;
        }
    }

    /**
     * Search KFA database for medicine match
     */
    private function searchKFADatabase(MedicineModel $medicine): ?array
    {
        try {
            // Call SatuSehat KFA API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->satuSehatApiKey,
                'Content-Type' => 'application/json',
            ])->get($this->satuSehatBaseUrl . '/kfa/search', [
                'query' => $medicine->name,
                'strength' => $medicine->strength,
            ]);

            if ($response->successful() && $response->json('data')) {
                $result = $response->json('data.0');
                return [
                    'code' => $result['code'],
                    'name' => $result['name'],
                    'unit' => $result['unit'],
                    'form' => $result['form'],
                    'strength' => $result['strength'] ?? null,
                    'is_narcotics' => $result['is_narcotics'] ?? false,
                    'is_psychotropics' => $result['is_psychotropics'] ?? false,
                    'is_precursor' => $result['is_precursor'] ?? false,
                ];
            }

            return null;
        } catch (\Exception $e) {
            \Log::error('KFA Search Error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Send data to SatuSehat API
     */
    private function sendToSatuSehatAPI(string $endpoint, array $data): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->satuSehatApiKey,
                'Content-Type' => 'application/json',
            ])->post($this->satuSehatBaseUrl . $endpoint, $data);

            return $response->json();
        } catch (\Exception $e) {
            \Log::error('SatuSehat API Error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Send data to government API
     */
    private function sendToGovernmentAPI(string $endpoint, array $data): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('pharmacy.government_api_key'),
                'Content-Type' => 'application/json',
            ])->post(config('pharmacy.government_api_url') . $endpoint, $data);

            return $response->json();
        } catch (\Exception $e) {
            \Log::error('Government API Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
