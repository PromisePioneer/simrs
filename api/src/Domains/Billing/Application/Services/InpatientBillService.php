<?php

declare(strict_types=1);

namespace Domains\Billing\Application\Services;

use Domains\Billing\Infrastructure\Persistence\Models\BillItemModel;
use Domains\Billing\Infrastructure\Persistence\Models\InpatientBillModel;
use Domains\Inpatient\Infrastructure\Persistence\Models\InpatientAdmissionModel;
use Illuminate\Support\Str;

class InpatientBillService
{
    /**
     * Buat draft tagihan saat pasien discharge (atau manual).
     */
    public function createDraftFromAdmission(InpatientAdmissionModel $admission): InpatientBillModel
    {
        $existing = InpatientBillModel::where('inpatient_admission_id', $admission->id)->first();
        if ($existing) {
            return $existing;
        }

        $bill = InpatientBillModel::create([
            'tenant_id'              => $admission->tenant_id,
            'inpatient_admission_id' => $admission->id,
            'patient_id'             => $admission->patient_id,
            'bill_number'            => $this->generateBillNumber('IPB'),
            'status'                 => 'draft',
            'subtotal'               => 0,
            'discount'               => 0,
            'tax'                    => 0,
            'total'                  => 0,
        ]);

        // Auto-generate item kamar berdasarkan jumlah hari rawat
        $admittedAt    = $admission->admitted_at ?? $admission->created_at;
        $dischargedAt  = $admission->discharged_at ?? now();
        $days          = max(1, (int) $admittedAt->diffInDays($dischargedAt));

        BillItemModel::create([
            'tenant_id'          => $admission->tenant_id,
            'inpatient_bill_id'  => $bill->id,
            'item_type'          => 'room',
            'description'        => "Biaya Kamar ({$days} hari)",
            'quantity'           => $days,
            'unit_price'         => 0, // diisi kasir sesuai tipe kamar
            'subtotal'           => 0,
        ]);

        // Biaya tindakan / nursing
        BillItemModel::create([
            'tenant_id'          => $admission->tenant_id,
            'inpatient_bill_id'  => $bill->id,
            'item_type'          => 'procedure',
            'description'        => 'Biaya Tindakan Keperawatan',
            'quantity'           => 1,
            'unit_price'         => 0,
            'subtotal'           => 0,
        ]);

        return $bill->fresh(['items']);
    }

    /**
     * Replace semua line items.
     */
    public function updateItems(InpatientBillModel $bill, array $items): InpatientBillModel
    {
        $bill->items()->delete();

        foreach ($items as $item) {
            $qty       = (int) ($item['quantity'] ?? 1);
            $unitPrice = (float) ($item['unit_price'] ?? 0);

            BillItemModel::create([
                'tenant_id'         => $bill->tenant_id,
                'inpatient_bill_id' => $bill->id,
                'item_type'         => $item['item_type'],
                'description'       => $item['description'],
                'quantity'          => $qty,
                'unit_price'        => $unitPrice,
                'subtotal'          => $qty * $unitPrice,
                'medicine_batch_id' => $item['medicine_batch_id'] ?? null,
            ]);
        }

        $this->recalculate($bill);
        return $bill->fresh(['items']);
    }

    /**
     * Bayar tagihan rawat inap & catat jurnal.
     */
    public function pay(InpatientBillModel $bill, array $data): InpatientBillModel
    {
        $bill->update([
            'status'            => 'paid',
            'paid_at'           => now(),
            'payment_method_id' => $data['payment_method_id'] ?? null,
            'notes'             => $data['notes'] ?? null,
        ]);

        app(AccountingJournalService::class)->recordBillPayment(
            tenantId:    $bill->tenant_id,
            billType:    'inpatient',
            billId:      $bill->id,
            amount:      (float) $bill->total,
            description: "Pembayaran Tagihan Rawat Inap #{$bill->bill_number}",
        );

        return $bill->fresh(['items', 'patient', 'paymentMethod']);
    }

    private function recalculate(InpatientBillModel $bill): void
    {
        $bill->refresh();
        $subtotal = $bill->items->sum('subtotal');
        $tax      = round($subtotal * 0.11, 2);
        $total    = $subtotal - (float) $bill->discount + $tax;

        $bill->update([
            'subtotal' => $subtotal,
            'tax'      => $tax,
            'total'    => max(0, $total),
        ]);
    }

    private function generateBillNumber(string $prefix): string
    {
        return $prefix . '-' . date('Ymd') . '-' . strtoupper(Str::random(6));
    }
}
