<?php

namespace Database\Seeders;

use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * AccountingSeeder
 *
 * Seed Chart of Accounts + Saldo Awal (Opening Balance) untuk setiap tenant.
 *
 * Cara pakai:
 *   php artisan db:seed --class=AccountingSeeder
 *
 * Atau tambahkan ke DatabaseSeeder:
 *   $this->call(AccountingSeeder::class);
 *
 * Konvensi kode akun:
 *   1-xxx = Aset        (normal balance: debit)
 *   2-xxx = Kewajiban   (normal balance: credit)
 *   3-xxx = Ekuitas     (normal balance: credit)
 *   4-xxx = Pendapatan  (normal balance: credit)
 *   5-xxx = Beban       (normal balance: debit)
 */
class AccountingSeeder extends Seeder
{
    /**
     * Definisi kategori akun.
     * Setiap kategori akan di-seed per tenant.
     */
    private array $categories = [
        ['name' => 'Aset',       'normal_balance' => 'debit'],
        ['name' => 'Kewajiban',  'normal_balance' => 'credit'],
        ['name' => 'Ekuitas',    'normal_balance' => 'credit'],
        ['name' => 'Pendapatan', 'normal_balance' => 'credit'],
        ['name' => 'Beban',      'normal_balance' => 'debit'],
    ];

    /**
     * Definisi akun (Chart of Accounts).
     * 'opening_balance' => saldo awal dalam rupiah (0 = tidak ada transaksi).
     * 'balance_type'    => 'debit' | 'credit' — tipe transaksi saldo awal.
     */
    private array $accounts = [
        // ── Aset ─────────────────────────────────────────────────────────────
        [
            'cat'             => 'Aset',
            'code'            => '1-100',
            'name'            => 'Kas Klinik',
            'opening_balance' => 50_000_000,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Aset',
            'code'            => '1-110',
            'name'            => 'Bank BCA',
            'opening_balance' => 200_000_000,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Aset',
            'code'            => '1-120',
            'name'            => 'Bank Mandiri',
            'opening_balance' => 100_000_000,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Aset',
            'code'            => '1-200',
            'name'            => 'Piutang Pasien',
            'opening_balance' => 15_000_000,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Aset',
            'code'            => '1-300',
            'name'            => 'Piutang Lainnya',
            'opening_balance' => 5_000_000,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Aset',
            'code'            => '1-400',
            'name'            => 'Persediaan Obat',
            'opening_balance' => 75_000_000,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Aset',
            'code'            => '1-500',
            'name'            => 'Perlengkapan Medis',
            'opening_balance' => 20_000_000,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Aset',
            'code'            => '1-600',
            'name'            => 'Peralatan & Inventaris',
            'opening_balance' => 150_000_000,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Aset',
            'code'            => '1-700',
            'name'            => 'Akumulasi Penyusutan Peralatan',
            'opening_balance' => 30_000_000,
            'balance_type'    => 'credit',  // contra-asset
        ],

        // ── Kewajiban ─────────────────────────────────────────────────────────
        [
            'cat'             => 'Kewajiban',
            'code'            => '2-100',
            'name'            => 'Hutang Dagang (Supplier Obat)',
            'opening_balance' => 25_000_000,
            'balance_type'    => 'credit',
        ],
        [
            'cat'             => 'Kewajiban',
            'code'            => '2-200',
            'name'            => 'Hutang Gaji',
            'opening_balance' => 18_000_000,
            'balance_type'    => 'credit',
        ],
        [
            'cat'             => 'Kewajiban',
            'code'            => '2-300',
            'name'            => 'Hutang Pajak (PPN)',
            'opening_balance' => 3_500_000,
            'balance_type'    => 'credit',
        ],
        [
            'cat'             => 'Kewajiban',
            'code'            => '2-400',
            'name'            => 'Pendapatan Diterima di Muka',
            'opening_balance' => 8_000_000,
            'balance_type'    => 'credit',
        ],
        [
            'cat'             => 'Kewajiban',
            'code'            => '2-500',
            'name'            => 'Hutang Bank Jangka Panjang',
            'opening_balance' => 120_000_000,
            'balance_type'    => 'credit',
        ],

        // ── Ekuitas ───────────────────────────────────────────────────────────
        [
            'cat'             => 'Ekuitas',
            'code'            => '3-100',
            'name'            => 'Modal Pemilik',
            'opening_balance' => 350_000_000,
            'balance_type'    => 'credit',
        ],
        [
            'cat'             => 'Ekuitas',
            'code'            => '3-200',
            'name'            => 'Laba Ditahan',
            'opening_balance' => 82_500_000,
            'balance_type'    => 'credit',
        ],

        // ── Pendapatan ────────────────────────────────────────────────────────
        [
            'cat'             => 'Pendapatan',
            'code'            => '4-100',
            'name'            => 'Pendapatan Rawat Jalan',
            'opening_balance' => 0,
            'balance_type'    => 'credit',
        ],
        [
            'cat'             => 'Pendapatan',
            'code'            => '4-200',
            'name'            => 'Pendapatan Rawat Inap',
            'opening_balance' => 0,
            'balance_type'    => 'credit',
        ],
        [
            'cat'             => 'Pendapatan',
            'code'            => '4-300',
            'name'            => 'Pendapatan Obat & Farmasi',
            'opening_balance' => 0,
            'balance_type'    => 'credit',
        ],
        [
            'cat'             => 'Pendapatan',
            'code'            => '4-400',
            'name'            => 'Pendapatan Tindakan Medis',
            'opening_balance' => 0,
            'balance_type'    => 'credit',
        ],
        [
            'cat'             => 'Pendapatan',
            'code'            => '4-900',
            'name'            => 'Pendapatan Lain-lain',
            'opening_balance' => 0,
            'balance_type'    => 'credit',
        ],

        // ── Beban ─────────────────────────────────────────────────────────────
        [
            'cat'             => 'Beban',
            'code'            => '5-100',
            'name'            => 'HPP Obat (COGS)',
            'opening_balance' => 0,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Beban',
            'code'            => '5-200',
            'name'            => 'Beban Gaji & Tunjangan',
            'opening_balance' => 0,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Beban',
            'code'            => '5-300',
            'name'            => 'Beban Sewa',
            'opening_balance' => 0,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Beban',
            'code'            => '5-400',
            'name'            => 'Beban Utilitas (Listrik, Air)',
            'opening_balance' => 0,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Beban',
            'code'            => '5-500',
            'name'            => 'Beban Perlengkapan Medis',
            'opening_balance' => 0,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Beban',
            'code'            => '5-600',
            'name'            => 'Beban Administrasi',
            'opening_balance' => 0,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Beban',
            'code'            => '5-700',
            'name'            => 'Beban Penyusutan',
            'opening_balance' => 0,
            'balance_type'    => 'debit',
        ],
        [
            'cat'             => 'Beban',
            'code'            => '5-900',
            'name'            => 'Beban Lain-lain',
            'opening_balance' => 0,
            'balance_type'    => 'debit',
        ],
    ];

    public function run(): void
    {
        $tenants = Tenant::all();

        if ($tenants->isEmpty()) {
            $this->command->warn('Tidak ada tenant ditemukan. Jalankan TenantSeeder terlebih dahulu.');
            return;
        }

        foreach ($tenants as $tenant) {
            $this->command->info("Seeding akuntansi untuk tenant: {$tenant->name} ({$tenant->id})");
            $this->seedForTenant($tenant->id);
            $this->seedJournalEntries($tenant->id);
        }

        $this->command->info('AccountingSeeder selesai.');
    }

    private function seedForTenant(string $tenantId): void
    {
        $now         = Carbon::now();
        $openingDate = $now->copy()->startOfYear(); // 1 Januari tahun ini

        // ── 1. Buat kategori akun (langsung ke tabel, bypass model) ──────────
        $categoryMap = [];
        foreach ($this->categories as $cat) {
            // Cek apakah sudah ada
            $existing = DB::table('account_categories')
                ->where('tenant_id', $tenantId)
                ->where('name', $cat['name'])
                ->first();

            if ($existing) {
                $categoryMap[$cat['name']] = $existing->id;
            } else {
                $id = Str::uuid()->toString();
                DB::table('account_categories')->insert([
                    'id'             => $id,
                    'tenant_id'      => $tenantId,
                    'name'           => $cat['name'],
                    'normal_balance' => $cat['normal_balance'],
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ]);
                $categoryMap[$cat['name']] = $id;
            }
        }

        // ── 2. Buat akun + saldo awal (langsung ke tabel accounts) ──────────
        foreach ($this->accounts as $acct) {
            $categoryId = $categoryMap[$acct['cat']];

            // Cek apakah akun sudah ada
            $existingAccount = DB::table('accounts')
                ->where('tenant_id', $tenantId)
                ->where('code', $acct['code'])
                ->first();

            if ($existingAccount) {
                $accountId = $existingAccount->id;
            } else {
                $accountId = Str::uuid()->toString();
                DB::table('accounts')->insert([
                    'id'                  => $accountId,
                    'tenant_id'           => $tenantId,
                    'account_category_id' => $categoryId,
                    'code'                => $acct['code'],
                    'name'                => $acct['name'],
                    'is_active'           => true,
                    'created_at'          => $now,
                    'updated_at'          => $now,
                ]);
            }

            // Catat saldo awal hanya jika > 0 dan belum ada
            if ($acct['opening_balance'] > 0) {
                $alreadySeeded = DB::table('account_transactions')
                    ->where('tenant_id', $tenantId)
                    ->where('account_id', $accountId)
                    ->where('reference', 'OPENING-BALANCE')
                    ->exists();

                if (! $alreadySeeded) {
                    DB::table('account_transactions')->insert([
                        'id'               => Str::uuid()->toString(),
                        'tenant_id'        => $tenantId,
                        'account_id'       => $accountId,
                        'type'             => $acct['balance_type'],
                        'amount'           => $acct['opening_balance'],
                        'description'      => 'Saldo awal ' . $acct['name'],
                        'reference'        => 'OPENING-BALANCE',
                        'transaction_date' => $openingDate->toDateString(),
                        'created_at'       => $now,
                        'updated_at'       => $now,
                    ]);
                }
            }
        }
    }

    /**
     * Seed jurnal entri operasional realistis (3 bulan terakhir).
     * Setiap jurnal selalu double-entry: total debit == total credit.
     *
     * Format tiap jurnal:
     *   'ref'         => string  — referensi unik (prefix, nanti diberi suffix nomor urut)
     *   'description' => string  — keterangan transaksi
     *   'date_offset' => int     — hari dari awal bulan (diulang tiap bulan)
     *   'entries'     => array   — pasangan debit/credit yang balance
     *     ['code', 'type', 'amount', 'description']
     */
    private function seedJournalEntries(string $tenantId): void
    {
        $now = Carbon::now();

        // Ambil semua akun milik tenant ini (code => id)
        $accountMap = DB::table('accounts')
            ->where('tenant_id', $tenantId)
            ->pluck('id', 'code')
            ->toArray();

        // Cek apakah jurnal sudah pernah di-seed (hindari duplikat)
        $alreadySeeded = DB::table('account_transactions')
            ->where('tenant_id', $tenantId)
            ->where('reference', 'like', 'JRN-%')
            ->exists();

        if ($alreadySeeded) {
            $this->command->warn("  Jurnal entri sudah ada untuk tenant {$tenantId}, skip.");
            return;
        }

        /**
         * Template jurnal bulanan.
         * Setiap entri adalah satu transaksi bisnis yang double-entry balanced.
         */
        $journalTemplates = [

            // ── PENDAPATAN ────────────────────────────────────────────────────

            [
                'ref'         => 'JRN-RJ',
                'description' => 'Pendapatan rawat jalan harian',
                'date_offset' => 3,
                'entries'     => [
                    ['code' => '1-100', 'type' => 'debit',  'amount' => 12_500_000, 'desc' => 'Penerimaan kas rawat jalan'],
                    ['code' => '4-100', 'type' => 'credit', 'amount' => 12_500_000, 'desc' => 'Pendapatan rawat jalan'],
                ],
            ],
            [
                'ref'         => 'JRN-RI',
                'description' => 'Pendapatan rawat inap',
                'date_offset' => 5,
                'entries'     => [
                    ['code' => '1-110', 'type' => 'debit',  'amount' => 25_000_000, 'desc' => 'Transfer masuk rawat inap'],
                    ['code' => '4-200', 'type' => 'credit', 'amount' => 25_000_000, 'desc' => 'Pendapatan rawat inap'],
                ],
            ],
            [
                'ref'         => 'JRN-FARM',
                'description' => 'Pendapatan penjualan obat & farmasi',
                'date_offset' => 7,
                'entries'     => [
                    ['code' => '1-100', 'type' => 'debit',  'amount' => 8_750_000, 'desc' => 'Kas penjualan farmasi'],
                    ['code' => '4-300', 'type' => 'credit', 'amount' => 8_750_000, 'desc' => 'Pendapatan obat & farmasi'],
                ],
            ],
            [
                'ref'         => 'JRN-TIND',
                'description' => 'Pendapatan tindakan medis',
                'date_offset' => 10,
                'entries'     => [
                    ['code' => '1-100', 'type' => 'debit',  'amount' => 6_000_000, 'desc' => 'Kas tindakan medis'],
                    ['code' => '4-400', 'type' => 'credit', 'amount' => 6_000_000, 'desc' => 'Pendapatan tindakan medis'],
                ],
            ],
            [
                'ref'         => 'JRN-PIUT',
                'description' => 'Tagihan pasien BPJS (piutang)',
                'date_offset' => 12,
                'entries'     => [
                    ['code' => '1-200', 'type' => 'debit',  'amount' => 18_000_000, 'desc' => 'Piutang klaim BPJS'],
                    ['code' => '4-100', 'type' => 'credit', 'amount' => 18_000_000, 'desc' => 'Pendapatan rawat jalan BPJS'],
                ],
            ],
            [
                'ref'         => 'JRN-PIUT-BAYAR',
                'description' => 'Pembayaran piutang BPJS diterima',
                'date_offset' => 20,
                'entries'     => [
                    ['code' => '1-110', 'type' => 'debit',  'amount' => 18_000_000, 'desc' => 'Transfer BPJS masuk'],
                    ['code' => '1-200', 'type' => 'credit', 'amount' => 18_000_000, 'desc' => 'Pelunasan piutang BPJS'],
                ],
            ],

            // ── HPP & PERSEDIAAN ──────────────────────────────────────────────

            [
                'ref'         => 'JRN-HPP',
                'description' => 'HPP obat yang terjual',
                'date_offset' => 7,
                'entries'     => [
                    ['code' => '5-100', 'type' => 'debit',  'amount' => 5_250_000, 'desc' => 'HPP penjualan obat'],
                    ['code' => '1-400', 'type' => 'credit', 'amount' => 5_250_000, 'desc' => 'Keluar persediaan obat'],
                ],
            ],
            [
                'ref'         => 'JRN-BELI-OBAT',
                'description' => 'Pembelian obat dari supplier',
                'date_offset' => 8,
                'entries'     => [
                    ['code' => '1-400', 'type' => 'debit',  'amount' => 15_000_000, 'desc' => 'Masuk persediaan obat'],
                    ['code' => '2-100', 'type' => 'credit', 'amount' => 15_000_000, 'desc' => 'Hutang dagang supplier obat'],
                ],
            ],
            [
                'ref'         => 'JRN-BAYAR-SUPPLIER',
                'description' => 'Pembayaran hutang dagang supplier',
                'date_offset' => 18,
                'entries'     => [
                    ['code' => '2-100', 'type' => 'debit',  'amount' => 15_000_000, 'desc' => 'Pelunasan hutang supplier'],
                    ['code' => '1-110', 'type' => 'credit', 'amount' => 15_000_000, 'desc' => 'Transfer ke supplier'],
                ],
            ],

            // ── BEBAN OPERASIONAL ─────────────────────────────────────────────

            [
                'ref'         => 'JRN-GAJI',
                'description' => 'Pembayaran gaji karyawan',
                'date_offset' => 25,
                'entries'     => [
                    ['code' => '5-200', 'type' => 'debit',  'amount' => 45_000_000, 'desc' => 'Beban gaji & tunjangan'],
                    ['code' => '1-110', 'type' => 'credit', 'amount' => 45_000_000, 'desc' => 'Transfer gaji via bank'],
                ],
            ],
            [
                'ref'         => 'JRN-SEWA',
                'description' => 'Pembayaran sewa gedung',
                'date_offset' => 1,
                'entries'     => [
                    ['code' => '5-300', 'type' => 'debit',  'amount' => 12_000_000, 'desc' => 'Beban sewa gedung klinik'],
                    ['code' => '1-110', 'type' => 'credit', 'amount' => 12_000_000, 'desc' => 'Transfer sewa'],
                ],
            ],
            [
                'ref'         => 'JRN-UTILITAS',
                'description' => 'Pembayaran listrik & air',
                'date_offset' => 15,
                'entries'     => [
                    ['code' => '5-400', 'type' => 'debit',  'amount' => 3_500_000, 'desc' => 'Beban listrik & air'],
                    ['code' => '1-100', 'type' => 'credit', 'amount' => 3_500_000, 'desc' => 'Kas untuk utilitas'],
                ],
            ],
            [
                'ref'         => 'JRN-PERLENGKAPAN',
                'description' => 'Pembelian perlengkapan medis habis pakai',
                'date_offset' => 9,
                'entries'     => [
                    ['code' => '5-500', 'type' => 'debit',  'amount' => 4_200_000, 'desc' => 'Beban perlengkapan medis'],
                    ['code' => '1-100', 'type' => 'credit', 'amount' => 4_200_000, 'desc' => 'Kas perlengkapan medis'],
                ],
            ],
            [
                'ref'         => 'JRN-ADMIN',
                'description' => 'Beban administrasi & ATK',
                'date_offset' => 14,
                'entries'     => [
                    ['code' => '5-600', 'type' => 'debit',  'amount' => 1_800_000, 'desc' => 'Beban administrasi & ATK'],
                    ['code' => '1-100', 'type' => 'credit', 'amount' => 1_800_000, 'desc' => 'Kas administrasi'],
                ],
            ],
            [
                'ref'         => 'JRN-PENYUSUTAN',
                'description' => 'Penyusutan peralatan medis bulanan',
                'date_offset' => 28,
                'entries'     => [
                    ['code' => '5-700', 'type' => 'debit',  'amount' => 2_500_000, 'desc' => 'Beban penyusutan peralatan'],
                    ['code' => '1-700', 'type' => 'credit', 'amount' => 2_500_000, 'desc' => 'Akumulasi penyusutan peralatan'],
                ],
            ],

            // ── PAJAK ─────────────────────────────────────────────────────────

            [
                'ref'         => 'JRN-PPN',
                'description' => 'Pencatatan hutang PPN bulan berjalan',
                'date_offset' => 26,
                'entries'     => [
                    ['code' => '5-900', 'type' => 'debit',  'amount' => 875_000, 'desc' => 'PPN keluaran bulan berjalan'],
                    ['code' => '2-300', 'type' => 'credit', 'amount' => 875_000, 'desc' => 'Hutang PPN'],
                ],
            ],
            [
                'ref'         => 'JRN-SETOR-PPN',
                'description' => 'Setoran PPN ke kas negara',
                'date_offset' => 27,
                'entries'     => [
                    ['code' => '2-300', 'type' => 'debit',  'amount' => 875_000, 'desc' => 'Pelunasan hutang PPN'],
                    ['code' => '1-110', 'type' => 'credit', 'amount' => 875_000, 'desc' => 'Transfer setoran PPN'],
                ],
            ],

            // ── TRANSFER ANTAR KAS/BANK ───────────────────────────────────────

            [
                'ref'         => 'JRN-TRANSFER',
                'description' => 'Setor kas ke rekening bank',
                'date_offset' => 11,
                'entries'     => [
                    ['code' => '1-110', 'type' => 'debit',  'amount' => 10_000_000, 'desc' => 'Setor kas ke bank BCA'],
                    ['code' => '1-100', 'type' => 'credit', 'amount' => 10_000_000, 'desc' => 'Keluar dari kas klinik'],
                ],
            ],

            // ── PENDAPATAN MUKA ───────────────────────────────────────────────

            [
                'ref'         => 'JRN-MUKA',
                'description' => 'Penerimaan uang muka paket rawat inap',
                'date_offset' => 4,
                'entries'     => [
                    ['code' => '1-100', 'type' => 'debit',  'amount' => 5_000_000, 'desc' => 'Uang muka paket rawat inap'],
                    ['code' => '2-400', 'type' => 'credit', 'amount' => 5_000_000, 'desc' => 'Pendapatan diterima di muka'],
                ],
            ],
            [
                'ref'         => 'JRN-REALISASI-MUKA',
                'description' => 'Realisasi uang muka menjadi pendapatan',
                'date_offset' => 22,
                'entries'     => [
                    ['code' => '2-400', 'type' => 'debit',  'amount' => 5_000_000, 'desc' => 'Realisasi pendapatan muka'],
                    ['code' => '4-200', 'type' => 'credit', 'amount' => 5_000_000, 'desc' => 'Pendapatan rawat inap terealisasi'],
                ],
            ],
        ];

        // Seed untuk 3 bulan terakhir
        $months = [
            $now->copy()->subMonths(2)->startOfMonth(),
            $now->copy()->subMonth()->startOfMonth(),
            $now->copy()->startOfMonth(),
        ];

        foreach ($months as $monthStart) {
            $monthLabel = $monthStart->format('Ym');

            foreach ($journalTemplates as $tpl) {
                $txDate    = $monthStart->copy()->addDays($tpl['date_offset'] - 1);
                $reference = $tpl['ref'] . '-' . $monthLabel;

                // Skip jika referensi ini sudah ada
                $exists = DB::table('account_transactions')
                    ->where('tenant_id', $tenantId)
                    ->where('reference', $reference)
                    ->exists();

                if ($exists) {
                    continue;
                }

                $rows = [];
                foreach ($tpl['entries'] as $entry) {
                    $accountId = $accountMap[$entry['code']] ?? null;
                    if (! $accountId) {
                        continue; // Akun belum di-setup, skip entry ini
                    }
                    $rows[] = [
                        'id'               => Str::uuid()->toString(),
                        'tenant_id'        => $tenantId,
                        'account_id'       => $accountId,
                        'type'             => $entry['type'],
                        'amount'           => $entry['amount'],
                        'description'      => $entry['desc'],
                        'reference'        => $reference,
                        'transaction_date' => $txDate->toDateString(),
                        'created_at'       => $now,
                        'updated_at'       => $now,
                    ];
                }

                if (count($rows) > 0) {
                    DB::table('account_transactions')->insert($rows);
                }
            }
        }

        $this->command->info("  ✓ Jurnal entri selesai untuk tenant {$tenantId}.");
    }
}
