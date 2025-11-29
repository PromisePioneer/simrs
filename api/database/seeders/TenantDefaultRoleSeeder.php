<?php

namespace Database\Seeders;

use App\Models\TenantDefaultPermission;
use App\Models\TenantDefaultRole;
use Illuminate\Database\Seeder;

class TenantDefaultRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultRoles = [
            'Owner',
            'Dokter',
            'Admin',
            'Perawat',
            'Kasir',
        ];


        foreach ($defaultRoles as $role) {
            TenantDefaultRole::create([
                'name' => $role,
                'guard_name' => 'web',
            ]);
        }
    }
}
