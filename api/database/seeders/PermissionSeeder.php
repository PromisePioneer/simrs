<?php

namespace Database\Seeders;

use Domains\IAM\Infrastructure\Persistence\Models\PermissionModel;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Permission dikelompokkan per nama module.
     * Nama module harus sama persis dengan yang ada di TenantModuleSeeder.
     *
     * CHANGELOG:
     * - Tambah permission Tempat Tidur (Rawat Inap)
     * - Tambah permission Resep Rawat Inap (Rawat Inap) — FITUR BARU
     * - Tambah module Farmasi: Obat, Kategori Obat, Gudang Obat, Rak Obat, Batch Obat
     * - Tambah permission Poli, Departemen (Master)
     */
    private array $permissions = [

        'Dashboard' => [
            'Melihat Dashboard',
        ],

        'Rawat Jalan' => [
            'Melihat Rawat Jalan',
            'Menambahkan Rawat Jalan',
            'Mengubah Rawat Jalan',
            'Menghapus Rawat Jalan',
        ],

        'Rawat Inap' => [
            // Rawat Inap (Admission)
            'Melihat Rawat Inap',
            'Membuat Rawat Inap',
            'Mengubah Rawat Inap',
            'Menghapus Rawat Inap',

            // Gedung
            'Melihat Gedung',
            'Membuat Gedung',
            'Mengubah Gedung',
            'Menghapus Gedung',

            // Ruang Rawat (Ward)
            'Melihat Ruang Rawat',
            'Membuat Ruang Rawat',
            'Mengubah Ruang Rawat',
            'Menghapus Ruang Rawat',

            // Tipe Ruangan
            'Melihat Tipe Ruangan',
            'Membuat Tipe Ruangan',
            'Mengubah Tipe Ruangan',
            'Menghapus Tipe Ruangan',

            // Ruangan (Room)
            'Melihat Ruangan',
            'Membuat Ruangan',
            'Mengubah Ruangan',
            'Menghapus Ruangan',

            // Tempat Tidur (Bed) — BARU
            'Melihat Tempat Tidur',
            'Membuat Tempat Tidur',
            'Mengubah Tempat Tidur',
            'Menghapus Tempat Tidur',

            // Resep Rawat Inap (InpatientPrescription) — FITUR BARU
            'Melihat Resep Rawat Inap',
            'Membuat Resep Rawat Inap',
            'Dispensing Resep Rawat Inap',
            'Membatalkan Resep Rawat Inap',
        ],

        'Fasilitas' => [
            'Melihat Fasilitas',
        ],

        'Electronic Medical Record' => [
            'Melihat Electronic Medical Record',
            'Melihat Penebusan Obat',
            'Menambahkan Penebusan Obat',
            'Mengubah Penebusan Obat',
            'Menghapus Penebusan Obat',
        ],

        // Farmasi — BARU (semua permission farmasi dipindah ke module ini)
        'Farmasi' => [
            'Melihat Farmasi',

            // Obat
            'Melihat Obat',
            'Menambahkan Obat',
            'Mengubah Obat',
            'Menghapus Obat',

            // Kategori Obat
            'Melihat Kategori Obat',
            'Menambahkan Kategori Obat',
            'Mengubah Kategori Obat',
            'Menghapus Kategori Obat',

            // Gudang Obat
            'Melihat Gudang Obat',
            'Menambahkan Gudang Obat',
            'Mengubah Gudang Obat',
            'Menghapus Gudang Obat',

            // Rak Obat
            'Melihat Rak Obat',
            'Menambahkan Rak Obat',
            'Mengubah Rak Obat',
            'Menghapus Rak Obat',

            // Batch Obat
            'Melihat Batch Obat',
            'Menambahkan Batch Obat',
            'Mengubah Batch Obat',
            'Menghapus Batch Obat',
        ],

        'Master' => [
            'Melihat Master',

            // Tipe Pembayaran
            'Melihat Tipe Pembayaran',
            'Menambahkan Tipe Pembayaran',
            'Mengubah Tipe Metode Pembayaran',
            'Menghapus Tipe Metode Pembayaran',

            // Profesi
            'Melihat Profesi',
            'Membuat Profesi',
            'Mengubah Profesi',
            'Menghapus Profesi',

            // Spesialisasi
            'Melihat Spesialisasi',
            'Membuat Spesialisasi',
            'Mengubah Spesialisasi',
            'Menghapus Spesialisasi',

            // Sub Spesialisasi
            'Melihat Sub Spesialisasi',
            'Membuat Sub Spesialisasi',
            'Mengubah Sub Spesialisasi',
            'Menghapus Sub Spesialisasi',

            // Lembaga Pendaftaran
            'Melihat Lembaga Pendaftaran',
            'Menambahkan Lembaga Pendaftaran',
            'Mengubah Lembaga Pendaftaran',
            'Menghapus Lembaga Pendaftaran',

            // Gelar
            'Melihat Gelar',
            'Menambahkan Gelar',
            'Mengubah Gelar',
            'Menghapus Gelar',

            // Departemen — BARU
            'Melihat Departemen',
            'Menambahkan Departemen',
            'Mengubah Departemen',
            'Menghapus Departemen',

            // Poli — BARU
            'Melihat Poli',
            'Menambahkan Poli',
            'Mengubah Poli',
            'Menghapus Poli',
        ],

        'Setting' => [
            'Melihat Setting',

            // Role
            'Melihat Role',
            'Menambahkan Role',
            'Mengubah Role',
            'Menghapus Role',

            // User Management
            'Melihat User Management',
            'Menambahkan User Management',
            'Mengubah User Management',
            'Menghapus User Management',
        ],

        'Office' => [
            'Melihat Office',

            // Pasien
            'Melihat Pasien',
            'Menambahkan Pasien',
            'Mengubah Pasien',
            'Menghapus Pasien',
        ],

        'Module Management' => [
            'Melihat Module Management',
            'Menambahkan Module Management',
            'Mengubah Module Management',
            'Menghapus Module Management',
        ],
    ];

    public function run(): void
    {
        $moduleMap = Module::pluck('id', 'name');

        foreach ($this->permissions as $moduleName => $permissionNames) {
            $moduleId = $moduleMap->get($moduleName);

            if (!$moduleId) {
                $this->command->warn("Module '{$moduleName}' tidak ditemukan, permission dilewati.");
                continue;
            }

            foreach ($permissionNames as $permissionName) {
                PermissionModel::updateOrCreate(
                    [
                        'name' => $permissionName,
                        'guard_name' => 'sanctum',
                    ],
                    [
                        'module_id' => $moduleId,
                    ]
                );
            }

            $this->command->info("✓ '{$moduleName}' — " . count($permissionNames) . " permission");
        }

        $this->command->info('PermissionSeeder selesai.');
    }
}
