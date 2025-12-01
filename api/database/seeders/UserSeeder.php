<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Hash;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // super admin
        $superAdmin = User::create([
            'id' => Str::uuid()->toString(),
            'name' => 'Administrator',
            'email' => 'admin@zyntera.net',
            'password' => Hash::make('zyntera'),
            'email_verified_at' => now()
        ]);
        $superAdmin->assignRole(Role::where('name', 'Super Admin')->first()->name);
        $tenants = Tenant::all();
        foreach ($tenants as $tenant) {
            /*
             *  DOCTOR
             */
            setPermissionsTeamId(null);
            $doctor = User::create([
                'id' => Str::uuid()->toString(),
                'name' => fake()->name,
                'email' => fake()->email,
                'tenant_id' => $tenant->id,
                'password' => Hash::make('zyntera'),
                'email_verified_at' => now()
            ]);
            $role = Role::where('name', 'Owner')
                ->first();

            if (!$role) {
                dump("role Owner belum ada untuk tenant {$tenant->id}");
                continue;
            }

            setPermissionsTeamId(null);
            $doctor->assignRole($role);

            for ($i = 0; $i < 3; $i++) {
                $nurse = User::create([
                    'name' => fake()->name,
                    'email' => fake()->email,
                    'tenant_id' => $tenant->id,
                    'password' => Hash::make('zyntera'),
                    'email_verified_at' => now()
                ]);
                setPermissionsTeamId(null);
                $nurse->assignRole(Role::where('name', 'Perawat')->first()->name);
            }


            for ($i = 0; $i < 3; $i++) {
                $nurse = User::create([
                    'name' => fake()->name,
                    'email' => fake()->email,
                    'tenant_id' => $tenant->id,
                    'password' => Hash::make('zyntera'),
                    'email_verified_at' => now()
                ]);
                setPermissionsTeamId(null);
                $nurse->assignRole(Role::where('name', 'Dokter')->first()->name);
            }

            for ($i = 0; $i < 3; $i++) {
                $admin = User::create([
                    'name' => fake()->name,
                    'email' => fake()->email,
                    'tenant_id' => $tenant->id,
                    'password' => Hash::make('zyntera'),
                    'email_verified_at' => now()
                ]);
                setPermissionsTeamId(null);
                $admin->assignRole(Role::where('name', 'Admin')->first()->name);
            }


            for ($i = 0; $i < 3; $i++) {
                $kasir = User::create([
                    'name' => fake()->name,
                    'email' => fake()->email,
                    'tenant_id' => $tenant->id,
                    'password' => Hash::make('zyntera'),
                    'email_verified_at' => now()
                ]);
                setPermissionsTeamId(null);
                $kasir->assignRole(Role::where('name', 'Kasir')->first()->name);
            }
        }
    }
}
