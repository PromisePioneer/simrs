<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use Domains\Pharmacy\Application\Services\PharmacyDefectaService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyDefectaReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyDefectaController
{
    protected $service;

    public function __construct(PharmacyDefectaService $service)
    {
        $this->service = $service;
    }

    /**
     * Generate defecta report for all medicines
     * POST /pharmacy/defecta/generate
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_id' => 'nullable|uuid|exists:warehouses,id',
        ]);

        try {
            $defectaItems = $this->service->generateDefectaReport(
                auth()->user()->tenant_id,
                $validated['warehouse_id'] ?? null
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Defecta report generated successfully',
                'data' => [
                    'total_items' => count($defectaItems),
                    'items' => $defectaItems,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * List defecta items by urgency
     * GET /pharmacy/defecta
     */
    public function index(Request $request): JsonResponse
    {
        $urgency = $request->query('urgency', 'all'); // all, urgent, normal
        $status = $request->query('status', 'unordered'); // all, ordered, unordered

        $query = PharmacyDefectaReport::where('tenant_id', auth()->user()->tenant_id)
            ->where('report_date', now()->format('Y-m-d'));

        if ($status === 'ordered') {
            $query->where('is_ordered', true);
        } elseif ($status === 'unordered') {
            $query->where('is_ordered', false);
        }

        $defectaItems = $this->service->getDefectaByUrgency(
            auth()->user()->tenant_id,
            $urgency
        );

        return response()->json([
            'status' => 'success',
            'data' => [
                'total' => count($defectaItems),
                'urgency_filter' => $urgency,
                'items' => $defectaItems,
            ],
        ]);
    }

    /**
     * Get only urgent defecta items
     * GET /pharmacy/defecta/urgent
     */
    public function urgent(Request $request): JsonResponse
    {
        try {
            $defectaItems = $this->service->getDefectaByUrgency(
                auth()->user()->tenant_id,
                'urgent'
            );

            return response()->json([
                'status' => 'success',
                'data' => [
                    'total_urgent' => count($defectaItems),
                    'items' => $defectaItems,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Mark defecta as ordered (create PO from defecta)
     * POST /pharmacy/defecta/{id}/mark-ordered
     */
    public function markOrdered(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'po_id' => 'required|uuid|exists:pharmacy_purchase_orders,id',
        ]);

        try {
            $defecta = $this->service->markAsOrdered($id, $validated['po_id']);

            return response()->json([
                'status' => 'success',
                'message' => 'Defecta marked as ordered',
                'data' => $defecta,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get defecta report with summary
     * GET /pharmacy/defecta/report
     */
    public function report(Request $request): JsonResponse
    {
        $date = $request->query('date', now()->format('Y-m-d'));

        $allDefecta = PharmacyDefectaReport::where('tenant_id', auth()->user()->tenant_id)
            ->where('report_date', $date)
            ->with('medicine')
            ->get();

        $urgent = $allDefecta->where('is_urgent', true);
        $ordered = $allDefecta->where('is_ordered', true);
        $pending = $allDefecta->where('is_ordered', false);

        $totalEstimatedCost = $allDefecta->sum('estimated_cost');
        $urgentEstimatedCost = $urgent->sum('estimated_cost');

        return response()->json([
            'status' => 'success',
            'data' => [
                'report_date' => $date,
                'summary' => [
                    'total_defecta_items' => $allDefecta->count(),
                    'urgent_count' => $urgent->count(),
                    'ordered_count' => $ordered->count(),
                    'pending_count' => $pending->count(),
                    'total_estimated_cost' => $totalEstimatedCost,
                    'urgent_estimated_cost' => $urgentEstimatedCost,
                ],
                'defecta_by_reason' => $this->groupByReason($allDefecta),
                'top_10_by_cost' => $allDefecta->sortByDesc('estimated_cost')
                    ->take(10)
                    ->values(),
            ],
        ]);
    }

    /**
     * Group defecta items by reason
     */
    private function groupByReason($defectaItems): array
    {
        $grouped = [];

        foreach ($defectaItems as $item) {
            $reasons = explode(',', $item->defecta_reason);
            foreach ($reasons as $reason) {
                $reason = trim($reason);
                if (!isset($grouped[$reason])) {
                    $grouped[$reason] = 0;
                }
                $grouped[$reason]++;
            }
        }

        return $grouped;
    }
}
