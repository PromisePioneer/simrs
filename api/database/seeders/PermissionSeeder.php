<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Permission dikelompokkan per nama module.
     * Nama module harus sama persis dengan yang ada di TenantModuleSeeder.
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
            'Melihat Rawat Inap',
            'Membuat Rawat Inap',
            'Mengubah Rawat Inap',
            'Menghapus Rawat Inap',

            'Melihat Gedung',
            'Membuat Gedung',
            'Mengubah Gedung',
            'Menghapus Gedung',

            'Melihat Ruang Rawat',
            'Membuat Ruang Rawat',
            'Mengubah Ruang Rawat',
            'Menghapus Ruang Rawat',

            'Melihat Tipe Ruangan',
            'Membuat Tipe Ruangan',
            'Mengubah Tipe Ruangan',
            'Menghapus Tipe Ruangan',

            'Melihat Ruangan',
            'Membuat Ruangan',
            'Mengubah Ruangan',
            'Menghapus Ruangan',
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

        'Master' => [
            'Melihat Master',
            'Melihat Tipe Pembayaran',
            'Menambahkan Tipe Pembayaran',
            'Mengubah Tipe Metode Pembayaran',
            'Menghapus Tipe Metode Pembayaran',

            'Melihat Profesi',
            'Membuat Profesi',
            'Mengubah Profesi',
            'Menghapus Profesi',

            'Melihat Spesialisasi',
            'Membuat Spesialisasi',
            'Mengubah Spesialisasi',
            'Menghapus Spesialisasi',

            'Melihat Sub Spesialisasi',
            'Membuat Sub Spesialisasi',
            'Mengubah Sub Spesialisasi',
            'Menghapus Sub Spesialisasi',

            'Melihat Lembaga Pendaftaran',
            'Menambahkan Lembaga Pendaftaran',
            'Mengubah Lembaga Pendaftaran',
            'Menghapus Lembaga Pendaftaran',

            'Melihat Gelar',
            'Menambahkan Gelar',
            'Mengubah Gelar',
            'Menghapus Gelar',
        ],

        'Setting' => [
            'Melihat Setting',
            'Melihat Role',
            'Menambahkan Role',
            'Mengubah Role',
            'Menghapus Role',

            'Melihat User Management',
            'Menambahkan User Management',
            'Mengubah User Management',
            'Menghapus User Management',
        ],

        'Office' => [
            'Melihat Office',

            'Melihat Pasien',
            'Menambahkan Pasien',
            'Mengubah Pasien',
            'Menghapus Pasien',
        ],

        // Module Management (child of Master)
        'Module Management' => [
            'Melihat Module Management',
            'Menambahkan Module Management',
            'Mengubah Module Management',
            'Menghapus Module Management',
        ],
    ];

    public function run(): void
    {
        // Cache module lookup by name
        $moduleMap = Module::pluck('id', 'name');

        foreach ($this->permissions as $moduleName => $permissionNames) {
            $moduleId = $moduleMap->get($moduleName);

            if (!$moduleId) {
                $this->command->warn("Module '{$moduleName}' tidak ditemukan, permission dilewati.");
                continue;
            }

            foreach ($permissionNames as $permissionName) {
                Permission::updateOrCreate(
                    [
                        'name'       => $permissionName,
                        'guard_name' => 'sanctum',
                    ],
                    [
                        'module_id' => $moduleId,
                    ]
                );
            }

            $this->command->info("Permission untuk module '{$moduleName}' ✓ (" . count($permissionNames) . " permission)");
        }

        $this->command->info('PermissionSeeder selesai.');
    }
}
