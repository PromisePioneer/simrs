<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use Domains\Pharmacy\Application\Services\PharmacyStockTransferService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyStockTransfer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PharmacyStockTransferController
{
    protected $service;

    public function __construct(PharmacyStockTransferService $service)
    {
        $this->service = $service;
    }

    /**
     * Create a new stock transfer
     * POST /pharmacy/transfers
     */
    public function create(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'source_warehouse_id' => 'required|uuid|exists:warehouses,id',
            'destination_warehouse_id' => 'required|uuid|exists:warehouses,id|different:source_warehouse_id',
            'items' => 'required|array|min:1',
            'items.*.medicine_batch_id' => 'required|uuid|exists:medicine_batches,id',
            'items.*.quantity_requested' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            $transfer = $this->service->createTransfer(auth()->user()->tenant_id, $validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock transfer created successfully',
                'data' => $transfer,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * List stock transfers
     * GET /pharmacy/transfers
     */
    public function index(Request $request): JsonResponse
    {
        $status = $request->query('status');
        $warehouseId = $request->query('warehouse_id');

        $query = PharmacyStockTransfer::where('tenant_id', auth()->user()->tenant_id);

        if ($status) {
            $query->where('status', $status);
        }

        if ($warehouseId) {
            $query->where(function ($q) use ($warehouseId) {
                $q->where('source_warehouse_id', $warehouseId)
                    ->orWhere('destination_warehouse_id', $warehouseId);
            });
        }

        $transfers = $query->with('items')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $transfers,
        ]);
    }

    /**
     * Show stock transfer details
     * GET /pharmacy/transfers/{id}
     */
    public function show(string $id): JsonResponse
    {
        $transfer = PharmacyStockTransfer::with('items', 'createdBy', 'approvedBy', 'receivedBy')
            ->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $transfer,
        ]);
    }

    /**
     * Approve stock transfer
     * POST /pharmacy/transfers/{id}/approve
     */
    public function approve(string $id): JsonResponse
    {
        try {
            $transfer = $this->service->approveTransfer($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock transfer approved',
                'data' => $transfer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Send stock transfer
     * POST /pharmacy/transfers/{id}/send
     */
    public function send(string $id): JsonResponse
    {
        try {
            $transfer = $this->service->sendTransfer($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock transfer sent',
                'data' => $transfer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Receive stock transfer
     * POST /pharmacy/transfers/{id}/receive
     */
    public function receive(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|uuid',
            'items.*.quantity_received' => 'required|integer|min:0',
        ]);

        try {
            $transfer = $this->service->receiveTransfer($id, $validated['items']);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock transfer received',
                'data' => $transfer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Cancel stock transfer
     * POST /pharmacy/transfers/{id}/cancel
     */
    public function cancel(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        try {
            $transfer = $this->service->cancelTransfer($id, $validated['reason']);

            return response()->json([
                'status' => 'success',
                'message' => 'Stock transfer cancelled',
                'data' => $transfer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete stock transfer (draft only)
     * DELETE /pharmacy/transfers/{id}
     */
    public function destroy(string $id): JsonResponse
    {
        $transfer = PharmacyStockTransfer::findOrFail($id);

        if ($transfer->status !== 'draft') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cannot delete non-draft transfer',
            ], 422);
        }

        $transfer->items()->delete();
        $transfer->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Stock transfer deleted',
        ]);
    }
}
