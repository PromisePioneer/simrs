<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use Domains\Pharmacy\Application\Services\SatuSehatPharmacyIntegrationService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyExternalSyncLog;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacySatuSehatMapping;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyIntegrationController
{
    protected $service;

    public function __construct(SatuSehatPharmacyIntegrationService $service)
    {
        $this->service = $service;
    }

    /**
     * Sync medicines to SatuSehat KFA database
     * POST /pharmacy/integration/sync-medicines
     */
    public function syncMedicines(Request $request): JsonResponse
    {
        try {
            $result = $this->service->syncMedicinesToSatuSehat(auth()->user()->tenant_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Medicines synced to SatuSehat',
                'data' => $result,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Validate KFA compliance for a medicine
     * POST /pharmacy/integration/validate-kfa
     */
    public function validateKFA(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_id' => 'required|uuid|exists:medicines,id',
        ]);

        try {
            $result = $this->service->validateKFACompliance($validated['medicine_id']);

            return response()->json([
                'status' => 'success',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Sync usage report to SatuSehat
     * POST /pharmacy/integration/sync-usage-report
     */
    public function syncUsageReport(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'report_date' => 'required|date',
        ]);

        try {
            $result = $this->service->syncUsageReportToSatuSehat(
                auth()->user()->tenant_id,
                $validated['report_date']
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Usage report synced to SatuSehat',
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Sync narcotics report to government (DINKES/BPOM)
     * POST /pharmacy/integration/sync-narcotics-report
     */
    public function syncNarcoticsReport(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'report_period' => 'required|string',
            'agency' => 'required|in:dinkes,bpom',
        ]);

        try {
            $result = $this->service->syncNarcoticsReportToGovernment(
                auth()->user()->tenant_id,
                $validated['report_period'],
                $validated['agency']
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Narcotics report synced to ' . strtoupper($validated['agency']),
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get sync logs
     * GET /pharmacy/integration/sync-logs
     */
    public function syncLogs(Request $request): JsonResponse
    {
        $system = $request->query('system');
        $status = $request->query('status');

        $query = PharmacyExternalSyncLog::where('tenant_id', auth()->user()->tenant_id);

        if ($system) {
            $query->where('external_system', $system);
        }

        if ($status) {
            $query->where('sync_status', $status);
        }

        $logs = $query->orderBy('started_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $logs,
        ]);
    }

    /**
     * Get KFA mappings
     * GET /pharmacy/integration/kfa-mapping
     */
    public function kfaMappings(Request $request): JsonResponse
    {
        $validOnly = $request->query('valid_only', false);
        $narcotics = $request->query('narcotics');

        $query = PharmacySatuSehatMapping::where('tenant_id', auth()->user()->tenant_id);

        if ($validOnly) {
            $query->where('is_valid', true);
        }

        if ($narcotics === 'true') {
            $query->where('is_narcotics', true);
        } elseif ($narcotics === 'false') {
            $query->where('is_narcotics', false);
        }

        $mappings = $query->with('medicine')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        $stats = [
            'total_mapped' => PharmacySatuSehatMapping::where('tenant_id', auth()->user()->tenant_id)->count(),
            'valid_mappings' => PharmacySatuSehatMapping::where('tenant_id', auth()->user()->tenant_id)
                ->where('is_valid', true)->count(),
            'invalid_mappings' => PharmacySatuSehatMapping::where('tenant_id', auth()->user()->tenant_id)
                ->where('is_valid', false)->count(),
            'narcotics_mapped' => PharmacySatuSehatMapping::where('tenant_id', auth()->user()->tenant_id)
                ->where('is_narcotics', true)->count(),
            'psychotropics_mapped' => PharmacySatuSehatMapping::where('tenant_id', auth()->user()->tenant_id)
                ->where('is_psychotropics', true)->count(),
        ];

        return response()->json([
            'status' => 'success',
            'stats' => $stats,
            'data' => $mappings,
        ]);
    }

    /**
     * Get integration status/health check
     * GET /pharmacy/integration/status
     */
    public function status(): JsonResponse
    {
        $tenantId = auth()->user()->tenant_id;

        $lastSyncLog = PharmacyExternalSyncLog::where('tenant_id', $tenantId)
            ->orderBy('completed_at', 'desc')
            ->first();

        $mappingStats = [
            'total' => PharmacySatuSehatMapping::where('tenant_id', $tenantId)->count(),
            'valid' => PharmacySatuSehatMapping::where('tenant_id', $tenantId)
                ->where('is_valid', true)->count(),
        ];

        $recentSyncs = PharmacyExternalSyncLog::where('tenant_id', $tenantId)
            ->where('sync_status', 'success')
            ->orderBy('completed_at', 'desc')
            ->limit(5)
            ->get(['external_system', 'sync_type', 'records_synced', 'completed_at']);

        return response()->json([
            'status' => 'success',
            'data' => [
                'integration_enabled' => config('pharmacy.satusehat.enable_sync'),
                'last_sync' => $lastSyncLog ? [
                    'system' => $lastSyncLog->external_system,
                    'type' => $lastSyncLog->sync_type,
                    'status' => $lastSyncLog->sync_status,
                    'completed_at' => $lastSyncLog->completed_at,
                ] : null,
                'mapping_stats' => $mappingStats,
                'compliance_rate' => $mappingStats['total'] > 0
                    ? round(($mappingStats['valid'] / $mappingStats['total']) * 100, 2)
                    : 0,
                'recent_syncs' => $recentSyncs,
            ],
        ]);
    }
}
