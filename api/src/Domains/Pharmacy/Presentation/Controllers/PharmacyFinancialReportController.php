<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use Domains\Pharmacy\Application\Services\PharmacyFinancialReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyFinancialReportController
{
    protected $service;

    public function __construct(PharmacyFinancialReportService $service)
    {
        $this->service = $service;
    }

    /**
     * Generate daily financial report
     * GET /pharmacy/reports/financial/daily
     */
    public function daily(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'nullable|date',
        ]);

        try {
            $report = $this->service->generateDailyReport(
                auth()->user()->tenant_id,
                $validated['date'] ?? null
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Daily financial report generated',
                'data' => $report,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Generate weekly financial report
     * GET /pharmacy/reports/financial/weekly
     */
    public function weekly(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'week' => 'nullable|integer|min:1|max:53',
            'year' => 'nullable|integer|min:2020',
        ]);

        try {
            $report = $this->service->generateWeeklyReport(
                auth()->user()->tenant_id,
                $validated['week'] ?? null,
                $validated['year'] ?? null
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Weekly financial report generated',
                'data' => $report,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Generate monthly financial report
     * GET /pharmacy/reports/financial/monthly
     */
    public function monthly(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year_month' => 'nullable|date_format:Y-m',
        ]);

        try {
            $report = $this->service->generateMonthlyReport(
                auth()->user()->tenant_id,
                $validated['year_month'] ?? null
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Monthly financial report generated',
                'data' => $report,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get revenue trend
     * GET /pharmacy/reports/revenue-trend
     */
    public function revenueTrend(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'period' => 'required|in:daily,weekly,monthly',
            'count' => 'nullable|integer|min:1|max:365',
        ]);

        try {
            $trend = $this->service->getRevenueTrend(
                auth()->user()->tenant_id,
                $validated['period'],
                $validated['count'] ?? 30
            );

            return response()->json([
                'status' => 'success',
                'data' => $trend,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get profit analysis
     * GET /pharmacy/reports/profit-analysis
     */
    public function profitAnalysis(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'period' => 'required|in:daily,weekly,monthly',
            'months' => 'nullable|integer|min:1|max:60',
        ]);

        try {
            $analysis = $this->service->getProfitAnalysis(
                auth()->user()->tenant_id,
                $validated['period'],
                $validated['months'] ?? 12
            );

            return response()->json([
                'status' => 'success',
                'data' => $analysis,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get cost analysis
     * GET /pharmacy/reports/cost-analysis
     */
    public function costAnalysis(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'period' => 'required|in:daily,weekly,monthly',
            'count' => 'nullable|integer|min:1|max:60',
        ]);

        try {
            $analysis = $this->service->getCostAnalysis(
                auth()->user()->tenant_id,
                $validated['period'],
                $validated['count'] ?? 12
            );

            return response()->json([
                'status' => 'success',
                'data' => $analysis,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get margin analysis by medicine
     * GET /pharmacy/reports/margin-by-medicine
     */
    public function marginByMedicine(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'period' => 'required|in:daily,weekly,monthly',
            'count' => 'nullable|integer|min:1|max:60',
        ]);

        try {
            $analysis = $this->service->getMarginAnalysisByMedicine(
                auth()->user()->tenant_id,
                $validated['period'],
                $validated['count'] ?? 12
            );

            return response()->json([
                'status' => 'success',
                'data' => $analysis,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }
}
