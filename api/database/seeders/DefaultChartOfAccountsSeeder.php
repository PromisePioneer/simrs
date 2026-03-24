<?php

namespace Database\Seeders;

use Domains\Accounting\Infrastructure\Persistence\Models\AccountCategoryModel;
use Domains\Accounting\Infrastructure\Persistence\Models\AccountModel;
use Illuminate\Database\Seeder;

/**
 * Seeder Chart of Accounts default untuk klinik.
 *
 * Jalankan per-tenant: php artisan db:seed --class=DefaultChartOfAccountsSeeder
 * Atau panggil dari TenantCreated event.
 *
 * Kode akun mengikuti konvensi:
 *   1-xxx = Aset
 *   2-xxx = Kewajiban
 *   3-xxx = Ekuitas
 *   4-xxx = Pendapatan
 *   5-xxx = Beban
 */
class DefaultChartOfAccountsSeeder extends Seeder
{
    public function run(string $tenantId): void
    {
        $categories = [
            ['name' => 'Aset',       'normal_balance' => 'debit'],
            ['name' => 'Kewajiban',  'normal_balance' => 'credit'],
            ['name' => 'Ekuitas',    'normal_balance' => 'credit'],
            ['name' => 'Pendapatan', 'normal_balance' => 'credit'],
            ['name' => 'Beban',      'normal_balance' => 'debit'],
        ];

        $created = [];
        foreach ($categories as $cat) {
            $created[$cat['name']] = AccountCategoryModel::create([
                'tenant_id'      => $tenantId,
                'name'           => $cat['name'],
                'normal_balance' => $cat['normal_balance'],
            ]);
        }

        $accounts = [
            // ── Aset ─────────────────────────────────────────────────────────
            ['cat' => 'Aset',       'code' => '1-100', 'name' => 'Kas Klinik'],
            ['cat' => 'Aset',       'code' => '1-110', 'name' => 'Bank'],
            ['cat' => 'Aset',       'code' => '1-200', 'name' => 'Piutang Pasien'],
            ['cat' => 'Aset',       'code' => '1-300', 'name' => 'Piutang Lainnya'],
            ['cat' => 'Aset',       'code' => '1-400', 'name' => 'Persediaan Obat'],
            ['cat' => 'Aset',       'code' => '1-500', 'name' => 'Perlengkapan Medis'],
            ['cat' => 'Aset',       'code' => '1-600', 'name' => 'Peralatan & Inventaris'],

            // ── Kewajiban ─────────────────────────────────────────────────────
            ['cat' => 'Kewajiban',  'code' => '2-100', 'name' => 'Hutang Dagang (Supplier Obat)'],
            ['cat' => 'Kewajiban',  'code' => '2-200', 'name' => 'Hutang Gaji'],
            ['cat' => 'Kewajiban',  'code' => '2-300', 'name' => 'Hutang Pajak (PPN)'],
            ['cat' => 'Kewajiban',  'code' => '2-400', 'name' => 'Pendapatan Diterima di Muka'],

            // ── Ekuitas ───────────────────────────────────────────────────────
            ['cat' => 'Ekuitas',    'code' => '3-100', 'name' => 'Modal Pemilik'],
            ['cat' => 'Ekuitas',    'code' => '3-200', 'name' => 'Laba Ditahan'],

            // ── Pendapatan ────────────────────────────────────────────────────
            ['cat' => 'Pendapatan', 'code' => '4-100', 'name' => 'Pendapatan Rawat Jalan'],
            ['cat' => 'Pendapatan', 'code' => '4-200', 'name' => 'Pendapatan Rawat Inap'],
            ['cat' => 'Pendapatan', 'code' => '4-300', 'name' => 'Pendapatan Obat & Farmasi'],
            ['cat' => 'Pendapatan', 'code' => '4-400', 'name' => 'Pendapatan Tindakan Medis'],
            ['cat' => 'Pendapatan', 'code' => '4-900', 'name' => 'Pendapatan Lain-lain'],

            // ── Beban ─────────────────────────────────────────────────────────
            ['cat' => 'Beban',      'code' => '5-100', 'name' => 'HPP Obat (COGS)'],
            ['cat' => 'Beban',      'code' => '5-200', 'name' => 'Beban Gaji & Tunjangan'],
            ['cat' => 'Beban',      'code' => '5-300', 'name' => 'Beban Sewa'],
            ['cat' => 'Beban',      'code' => '5-400', 'name' => 'Beban Utilitas (Listrik, Air)'],
            ['cat' => 'Beban',      'code' => '5-500', 'name' => 'Beban Perlengkapan Medis'],
            ['cat' => 'Beban',      'code' => '5-600', 'name' => 'Beban Administrasi'],
            ['cat' => 'Beban',      'code' => '5-900', 'name' => 'Beban Lain-lain'],
        ];

        foreach ($accounts as $acct) {
            AccountModel::create([
                'tenant_id'           => $tenantId,
                'account_category_id' => $created[$acct['cat']]->id,
                'code'                => $acct['code'],
                'name'                => $acct['name'],
            ]);
        }
    }
}
