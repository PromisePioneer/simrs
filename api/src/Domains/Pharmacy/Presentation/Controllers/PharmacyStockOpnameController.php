<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use Domains\Pharmacy\Application\Services\PharmacyStockOpnameService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyStockOpname;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyStockOpnameController
{
    protected $service;

    public function __construct(PharmacyStockOpnameService $service)
    {
        $this->service = $service;
    }

    /**
     * Create a new stock opname session
     * POST /pharmacy/opnames
     */
    public function create(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'warehouse_id' => 'required|uuid|exists:warehouses,id',
            'opname_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        try {
            $opname = $this->service->createOpname(auth()->user()->tenant_id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock opname created successfully',
                'data' => $opname,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * List stock opnames
     * GET /pharmacy/opnames
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $warehouseId = $request->query('warehouse_id');

        $query = PharmacyStockOpname::where('tenant_id', auth()->user()->tenant_id);

        if ($status) {
            $query->where('status', $status);
        }

        if ($warehouseId) {
            $query->where('warehouse_id', $warehouseId);
        }

        $opnames = $query->with('items')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $opnames,
        ]);
    }

    /**
     * Add item to opname
     * POST /pharmacy/opnames/{id}/items
     */
    public function addItem(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'medicine_batch_id' => 'required|uuid|exists:medicine_batches,id',
            'physical_quantity' => 'required|integer|min:0',
            'unit_cost' => 'nullable|numeric|min:0',
            'variance_reason' => 'nullable|string|max:500',
            'notes' => 'nullable|string',
        ]);

        try {
            $item = $this->service->addOpnameItem($id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Opname item added successfully',
                'data' => $item,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get opname details with items
     * GET /pharmacy/opnames/{id}
     */
    public function show(string $id): JsonResponse
    {
        $opname = PharmacyStockOpname::with('items', 'startedBy', 'finalizedBy')
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $opname,
        ]);
    }

    /**
     * Finalize opname
     * POST /pharmacy/opnames/{id}/finalize
     */
    public function finalize(string $id): JsonResponse
    {
        try {
            $opname = $this->service->finalizeOpname($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock opname finalized',
                'data' => $opname,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Reconcile opname - apply variances to system
     * POST /pharmacy/opnames/{id}/reconcile
     */
    public function reconcile(string $id): JsonResponse
    {
        try {
            $opname = $this->service->reconcileOpname($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock opname reconciled',
                'data' => $opname,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Get variance report
     * GET /pharmacy/opnames/{id}/variance-report
     */
    public function varianceReport(string $id): JsonResponse
    {
        try {
            $report = $this->service->getVarianceReport($id);

            return response()->json([
                'status' => 'success',
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
     * Delete opname (draft only)
     * DELETE /pharmacy/opnames/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $opname = PharmacyStockOpname::findOrFail($id);

        if ($opname->status !== 'draft') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete non-draft opname',
            ], 422);
        }

        $opname->items()->delete();
        $opname->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Stock opname deleted',
        ]);
    }
}
