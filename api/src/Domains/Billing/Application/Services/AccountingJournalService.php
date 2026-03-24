<?php

declare(strict_types=1);

namespace Domains\Billing\Application\Services;

use Domains\Accounting\Infrastructure\Persistence\Models\AccountModel;
use Domains\Accounting\Infrastructure\Persistence\Models\AccountTransactionModel;

/**
 * Service yang menjembatani Billing → Accounting.
 *
 * Setiap pembayaran tagihan membuat 2 transaksi jurnal:
 *   DEBIT  : Kas / Bank (account_type = asset, sub = cash/bank)
 *   CREDIT : Pendapatan Rawat Jalan / Rawat Inap
 *
 * Akun yang dipakai dicari berdasarkan kode konvensi:
 *   1-100  = Kas Klinik
 *   4-100  = Pendapatan Rawat Jalan
 *   4-200  = Pendapatan Rawat Inap
 */
class AccountingJournalService
{
    /**
     * Catat jurnal pembayaran tagihan.
     */
    public function recordBillPayment(
        string $tenantId,
        string $billType,    // 'outpatient' | 'inpatient'
        string $billId,
        float  $amount,
        string $description,
    ): void {
        $cashAccount    = $this->findAccount($tenantId, '1-100');
        $revenueAccount = $billType === 'inpatient'
            ? $this->findAccount($tenantId, '4-200')
            : $this->findAccount($tenantId, '4-100');

        if (!$cashAccount || !$revenueAccount) {
            // Akun belum di-setup — skip tanpa error agar billing tetap jalan
            \Log::warning("AccountingJournalService: akun jurnal belum dikonfigurasi untuk tenant {$tenantId}");
            return;
        }

        $ref = "BILL-{$billType}-{$billId}";

        // DEBIT Kas
        AccountTransactionModel::create([
            'tenant_id'   => $tenantId,
            'account_id'  => $cashAccount->id,
            'type'        => 'debit',
            'amount'      => $amount,
            'description' => $description,
            'reference'   => $ref,
        ]);

        // CREDIT Pendapatan
        AccountTransactionModel::create([
            'tenant_id'   => $tenantId,
            'account_id'  => $revenueAccount->id,
            'type'        => 'credit',
            'amount'      => $amount,
            'description' => $description,
            'reference'   => $ref,
        ]);
    }

    /**
     * Catat jurnal pengeluaran obat (inventory keluar).
     * Dipanggil saat MedicineBatch dikurangi stoknya.
     */
    public function recordInventoryOut(
        string $tenantId,
        float  $amount,
        string $description,
    ): void {
        $inventoryAccount = $this->findAccount($tenantId, '1-400'); // Persediaan Obat
        $cogsAccount      = $this->findAccount($tenantId, '5-100'); // HPP Obat

        if (!$inventoryAccount || !$cogsAccount) {
            return;
        }

        $ref = 'INV-OUT-' . now()->format('YmdHis');

        AccountTransactionModel::create([
            'tenant_id'   => $tenantId,
            'account_id'  => $cogsAccount->id,
            'type'        => 'debit',
            'amount'      => $amount,
            'description' => $description,
            'reference'   => $ref,
        ]);

        AccountTransactionModel::create([
            'tenant_id'   => $tenantId,
            'account_id'  => $inventoryAccount->id,
            'type'        => 'credit',
            'amount'      => $amount,
            'description' => $description,
            'reference'   => $ref,
        ]);
    }

    /**
     * Catat jurnal pembelian obat (inventory masuk).
     * Dipanggil saat MedicineBatch baru dibuat dengan purchase_price.
     */
    public function recordInventoryIn(
        string $tenantId,
        float  $amount,
        string $description,
    ): void {
        $inventoryAccount  = $this->findAccount($tenantId, '1-400'); // Persediaan Obat
        $payableAccount    = $this->findAccount($tenantId, '2-100'); // Hutang Dagang

        if (!$inventoryAccount || !$payableAccount) {
            return;
        }

        $ref = 'INV-IN-' . now()->format('YmdHis');

        AccountTransactionModel::create([
            'tenant_id'   => $tenantId,
            'account_id'  => $inventoryAccount->id,
            'type'        => 'debit',
            'amount'      => $amount,
            'description' => $description,
            'reference'   => $ref,
        ]);

        AccountTransactionModel::create([
            'tenant_id'   => $tenantId,
            'account_id'  => $payableAccount->id,
            'type'        => 'credit',
            'amount'      => $amount,
            'description' => $description,
            'reference'   => $ref,
        ]);
    }

    private function findAccount(string $tenantId, string $code): ?AccountModel
    {
        return AccountModel::where('tenant_id', $tenantId)
            ->where('code', $code)
            ->first();
    }
}
