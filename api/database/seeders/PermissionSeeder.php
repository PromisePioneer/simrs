<?php

namespace Database\Seeders;

use App\Models\Tenant;
use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            //dashboard
            'Melihat Dashboard',

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


            // Rak Obat
            'Melihat Rak Obat',
            'Membuat Rak Obat',
            'Mengubah Rak Obat',
            'Menghapus Rak Obat',

            // Kategori Obat
            'Melihat Kategori Obat',
            'Menambah Kategori Obat',
            'Mengubah Kategori Obat',
            'Menghapus Kategori Obat',

            // Satuan Obat
            'Melihat Satuan Obat',
            'Menambahkan Satuan Obat',
            'Mengubah Satuan Obat',
            'Menghapus Satuan Obat',

            // Obat
            'Melihat Obat',
            'Membuat Obat',
            'Mengubah Obat',
            'Menghapus Obat',

            // Lembaga Pendaftaran
            'Melihat Lembaga Pendaftaran',
            'Menambahkan Lembaga Pendaftaran',
            'Mengubah Lembaga Pendaftaran',
            'Menghapus Lembaga Pendaftaran',

            // Master
            'Melihat Master',

            // Pembayaran
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
            "Membuat Spesialisasi",
            "Mengubah Spesialisasi",
            "Menghapus Spesialisasi",


            // Sup SPesialisasi
            "Melihat Sub Spesialisasi",
            "Membuat Sub Spesialisasi",
            "Mengubah Sub Spesialisasi",
            "Menghapus Sub Spesialisasi",


            // setting
            "Melihat Setting",

            // Pasien
            "Melihat Pasien",
            "Menambahkan Pasien",
            "Mengubah Pasien",
            "Menghapus Pasien",


            "Melihat Gelar",
            "Menambahkan Gelar",
            "Mengubah Gelar",
            "Menghapus Gelar",

        ];


        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate([
                    'name' => $permission,
                    'module_id' => $tenant->id,
                    'tenant_id' => $tenant->id,
                    'guard_name' => 'web'
                ]);
            }
        }
    }
}
