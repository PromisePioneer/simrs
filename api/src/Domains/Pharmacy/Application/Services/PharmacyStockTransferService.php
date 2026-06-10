<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyStockTransfer;
use Domains\Pharmacy\Infrastructure\Persistence\Models\PharmacyStockTransferItem;
use Illuminate\Support\Facades\DB;

class PharmacyStockTransferService
{
    /**
     * Create a new stock transfer request
     */
    public function createTransfer(string $tenantId, array $data): PharmacyStockTransfer
    {
        return DB::transaction(function () use ($tenantId, $data) {
            $transferNumber = $this->generateTransferNumber($tenantId);

            $transfer = PharmacyStockTransfer::create([
                'tenant_id' => $tenantId,
                'transfer_number' => $transferNumber,
                'source_warehouse_id' => $data['source_warehouse_id'],
                'destination_warehouse_id' => $data['destination_warehouse_id'],
                'transfer_date' => now(),
                'status' => 'draft',
                'notes' => $data['notes'] ?? null,
                'created_by' => auth()->id(),
            ]);

            if (!empty($data['items'])) {
                foreach ($data['items'] as $item) {
                    $this->addTransferItem($transfer->id, $item);
                }
            }

            return $transfer->load('items');
        });
    }

    /**
     * Add item to transfer
     */
    public function addTransferItem(string $transferId, array $data): PharmacyStockTransferItem
    {
        return PharmacyStockTransferItem::create([
            'transfer_id' => $transferId,
            'medicine_batch_id' => $data['medicine_batch_id'],
            'quantity_requested' => $data['quantity_requested'],
            'notes' => $data['notes'] ?? null,
        ]);
    }

    /**
     * Approve transfer request
     */
    public function approveTransfer(string $transferId): PharmacyStockTransfer
    {
        $transfer = PharmacyStockTransfer::findOrFail($transferId);

        if ($transfer->status !== 'draft') {
            throw new \Exception('Transfer can only be approved from draft status');
        }

        $transfer->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
        ]);

        return $transfer;
    }

    /**
     * Send transfer to destination
     */
    public function sendTransfer(string $transferId): PharmacyStockTransfer
    {
        $transfer = PharmacyStockTransfer::with('items')->findOrFail($transferId);

        if ($transfer->status !== 'approved') {
            throw new \Exception('Transfer must be approved before sending');
        }

        return DB::transaction(function () use ($transfer) {
            // Update quantities sent
            foreach ($transfer->items as $item) {
                $item->update(['quantity_sent' => $item->quantity_requested]);
            }

            // Deduct from source warehouse
            $this->deductFromSourceWarehouse($transfer);

            $transfer->update([
                'status' => 'sent',
                'transfer_date' => now(),
            ]);

            return $transfer;
        });
    }

    /**
     * Receive transfer at destination
     */
    public function receiveTransfer(string $transferId, array $receivedItems): PharmacyStockTransfer
    {
        $transfer = PharmacyStockTransfer::with('items')->findOrFail($transferId);

        if ($transfer->status !== 'sent') {
            throw new \Exception('Transfer must be sent before receiving');
        }

        return DB::transaction(function () use ($transfer, $receivedItems) {
            foreach ($receivedItems as $itemData) {
                $item = $transfer->items()->findOrFail($itemData['item_id']);
                $item->update(['quantity_received' => $itemData['quantity_received']]);
            }

            // Add to destination warehouse
            $this->addToDestinationWarehouse($transfer);

            $transfer->update([
                'status' => 'received',
                'received_date' => now(),
                'received_by' => auth()->id(),
            ]);

            return $transfer;
        });
    }

    /**
     * Cancel transfer
     */
    public function cancelTransfer(string $transferId, string $reason): PharmacyStockTransfer
    {
        $transfer = PharmacyStockTransfer::findOrFail($transferId);

        if (in_array($transfer->status, ['sent', 'received'])) {
            throw new \Exception('Cannot cancel transfer that is already sent or received');
        }

        $transfer->update([
            'status' => 'cancelled',
            'notes' => ($transfer->notes ?? '') . "\n[CANCELLED] " . $reason,
        ]);

        return $transfer;
    }

    /**
     * Generate unique transfer number
     */
    private function generateTransferNumber(string $tenantId): string
    {
        $prefix = 'TRF';
        $date = now()->format('Ym');
        $count = PharmacyStockTransfer::where('tenant_id', $tenantId)
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count() + 1;

        return sprintf('%s-%s-%04d', $prefix, $date, $count);
    }

    /**
     * Deduct from source warehouse stock
     */
    private function deductFromSourceWarehouse(PharmacyStockTransfer $transfer): void
    {
        foreach ($transfer->items as $item) {
            // Update medicine_batch_stocks for source warehouse
            DB::table('medicine_batch_stocks')
                ->where('batch_id', $item->medicine_batch_id)
                ->where('warehouse_id', $transfer->source_warehouse_id)
                ->decrement('quantity', $item->quantity_sent);
        }
    }

    /**
     * Add to destination warehouse stock
     */
    private function addToDestinationWarehouse(PharmacyStockTransfer $transfer): void
    {
        foreach ($transfer->items as $item) {
            // Update medicine_batch_stocks for destination warehouse
            DB::table('medicine_batch_stocks')
                ->where('batch_id', $item->medicine_batch_id)
                ->where('warehouse_id', $transfer->destination_warehouse_id)
                ->increment('quantity', $item->quantity_received);
        }
    }
}
