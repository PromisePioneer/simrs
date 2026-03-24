<?php

declare(strict_types=1);

namespace Domains\Billing\Application\Services;

use Domains\Billing\Infrastructure\Persistence\Models\BillItemModel;
use Domains\Billing\Infrastructure\Persistence\Models\OutpatientBillModel;
use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OutpatientBillService
{
    /**
     * Buat draft tagihan otomatis saat visit selesai.
     * Dipanggil dari OutpatientVisitService setelah status = done.
     */
    public function createDraftFromVisit(OutpatientVisitModel $visit): OutpatientBillModel
    {
        // Cegah duplikasi — kalau sudah ada bill untuk visit ini, return existing
        $existing = OutpatientBillModel::where('outpatient_visit_id', $visit->id)->first();
        if ($existing) {
            return $existing;
        }

        $bill = OutpatientBillModel::create([
            'tenant_id'           => $visit->tenant_id,
            'outpatient_visit_id' => $visit->id,
            'patient_id'          => $visit->patient_id,
            'bill_number'         => $this->generateBillNumber('OPB'),
            'status'              => 'draft',
            'subtotal'            => 0,
            'discount'            => 0,
            'tax'                 => 0,
            'total'               => 0,
        ]);

        // Auto-generate item konsultasi (tarif flat, bisa disesuaikan nanti)
        BillItemModel::create([
            'tenant_id'   => $visit->tenant_id,
            'bill_id'     => $bill->id,
            'item_type'   => 'consultation',
            'description' => 'Biaya Konsultasi Dokter',
            'quantity'    => 1,
            'unit_price'  => 0, // diisi kasir
            'subtotal'    => 0,
        ]);

        // Tambahkan item obat dari prescription jika sudah dispensed
        $this->syncMedicineItems($bill, $visit);

        $this->recalculate($bill);

        return $bill->fresh(['items']);
    }

    /**
     * Tambah / update line items.
     */
    public function updateItems(OutpatientBillModel $bill, array $items): OutpatientBillModel
    {
        // Hapus item lama yang dikirim ulang (replace strategy)
        $bill->items()->delete();

        foreach ($items as $item) {
            $qty        = (int) ($item['quantity'] ?? 1);
            $unitPrice  = (float) ($item['unit_price'] ?? 0);

            BillItemModel::create([
                'tenant_id'         => $bill->tenant_id,
                'bill_id'           => $bill->id,
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
     * Bayar tagihan & catat jurnal akuntansi.
     */
    public function pay(OutpatientBillModel $bill, array $data): OutpatientBillModel
    {
        $bill->update([
            'status'            => 'paid',
            'paid_at'           => now(),
            'payment_method_id' => $data['payment_method_id'] ?? null,
            'notes'             => $data['notes'] ?? null,
        ]);

        // Sinkronisasi ke jurnal akuntansi
        app(AccountingJournalService::class)->recordBillPayment(
            tenantId: $bill->tenant_id,
            billType: 'outpatient',
            billId:   $bill->id,
            amount:   (float) $bill->total,
            description: "Pembayaran Tagihan Rawat Jalan #{$bill->bill_number}",
        );

        return $bill->fresh(['items', 'patient', 'paymentMethod']);
    }

    /**
     * Hitung ulang total dari semua items.
     */
    private function recalculate(OutpatientBillModel $bill): void
    {
        $bill->refresh();
        $subtotal = $bill->items->sum('subtotal');
        $tax      = round($subtotal * 0.11, 2); // PPN 11% — configurable
        $total    = $subtotal - (float) $bill->discount + $tax;

        $bill->update([
            'subtotal' => $subtotal,
            'tax'      => $tax,
            'total'    => max(0, $total),
        ]);
    }

    /**
     * Sync obat yang sudah dispensed dari prescriptions.
     */
    private function syncMedicineItems(OutpatientBillModel $bill, OutpatientVisitModel $visit): void
    {
        $prescriptions = $visit->prescriptions()
            ->where('status', 'dispensed')
            ->with('medicationItems.medicineBatch.medicine')
            ->get();

        foreach ($prescriptions as $prescription) {
            foreach ($prescription->medicationItems ?? [] as $medItem) {
                BillItemModel::create([
                    'tenant_id'         => $bill->tenant_id,
                    'bill_id'           => $bill->id,
                    'item_type'         => 'medicine',
                    'description'       => $medItem->medicineBatch->medicine->name ?? 'Obat',
                    'quantity'          => $medItem->quantity ?? 1,
                    'unit_price'        => $medItem->medicineBatch->sell_price ?? 0,
                    'subtotal'          => ($medItem->quantity ?? 1) * ($medItem->medicineBatch->sell_price ?? 0),
                    'medicine_batch_id' => $medItem->medicine_batch_id,
                ]);
            }
        }
    }

    private function generateBillNumber(string $prefix): string
    {
        return $prefix . '-' . date('Ymd') . '-' . strtoupper(Str::random(6));
    }
}
