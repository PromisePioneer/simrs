<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

/**
 * Tambahkan permission baru untuk Accounting dan Billing.
 *
 * Jalankan: php artisan db:seed --class=AccountingBillingPermissionsSeeder
 */
class AccountingBillingPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            // ── Accounting ────────────────────────────────────────────────
            'Melihat Akuntansi',
            'Menambahkan Entri Akuntansi',
            'Mengubah Akuntansi',
            'Menghapus Akuntansi',

            'Melihat Kategori Akun',
            'Menambahkan Kategori Akun',
            'Mengubah Kategori Akun',
            'Menghapus Kategori Akun',

            'Melihat Jurnal Entri',
            'Menambahkan Jurnal Entri',

            'Melihat Laporan Keuangan',

            // ── Billing Rawat Jalan ───────────────────────────────────────
            'Melihat Tagihan Rawat Jalan',
            'Membuat Tagihan Rawat Jalan',
            'Mengubah Tagihan Rawat Jalan',
            'Memproses Pembayaran Rawat Jalan',

            // ── Billing Rawat Inap ────────────────────────────────────────
            'Melihat Tagihan Rawat Inap',
            'Membuat Tagihan Rawat Inap',
            'Mengubah Tagihan Rawat Inap',
            'Memproses Pembayaran Rawat Inap',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => 'web']
            );
        }

        $this->command->info('Accounting & Billing permissions seeded (' . count($permissions) . ' items).');
    }
}
