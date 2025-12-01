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
            "Melihat Menu master",

            "Melihat role",
            "Menambahkan role",
            "Ubah role",

            'Melihat Pengguna',
            'Menambahkan Pengguna',
            'Ubah Pengguna',
            'Menghapus Pengguna',

            'Melihat Pasien',
            'Menambahkan Pasien',
            'Mengubah Pasien',
            'Menghapus Pasien',
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
