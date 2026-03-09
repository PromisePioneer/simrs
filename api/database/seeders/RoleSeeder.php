<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\TenantDefaultRole;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultRoles = [
            'Super Admin',
            'Owner',
            'Kasir',
            'Admin',
            'Perawat',
            'Dokter'
        ];

        foreach ($defaultRoles as $roleName) {
            Role::create([
                'name' => $roleName,
                'tenant_id' => null,
                'guard_name' => 'sanctum'
            ]);
        }
    }
}
