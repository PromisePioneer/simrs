<?php

namespace Database\Seeders;

use App\Models\Poli;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Domains\IAM\Infrastructure\Persistence\Models\RoleModel;
use Domains\MasterData\Infrastructure\Persistent\Models\PoliModel;
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
        $superAdmin->assignRole(RoleModel::where('name', 'Super Admin')->first()->name);
        $tenants = Tenant::all();
        foreach ($tenants as $tenant) {
            /*
             *  DOCTOR
             */
            setPermissionsTeamId(null);
            $owner = User::create([
                'id' => Str::uuid()->toString(),
                'name' => fake()->name,
                'email' => fake()->email,
                'tenant_id' => $tenant->id,
                'password' => Hash::make('zyntera'),
                'email_verified_at' => now()
            ]);
            $role = RoleModel::where('name', 'Owner')
                ->first();

            if (!$role) {
                dump("role Owner belum ada untuk tenant {$tenant->id}");
                continue;
            }

            setPermissionsTeamId(null);
            $owner->assignRole($role);

            for ($i = 0; $i < 3; $i++) {
                $nurse = User::create([
                    'name' => fake()->name,
                    'email' => fake()->email,
                    'tenant_id' => $tenant->id,
                    'password' => Hash::make('zyntera'),
                    'email_verified_at' => now()
                ]);
                setPermissionsTeamId(null);
                $nurse->assignRole(RoleModel::where('name', 'Perawat')->first()->name);
            }


            for ($i = 0; $i < 3; $i++) {
                $doctor = User::create([
                    'name' => fake()->name,
                    'email' => fake()->email,
                    'tenant_id' => $tenant->id,
                    'password' => Hash::make('zyntera'),
                    'email_verified_at' => now(),
                    'poli_id' => PoliModel::inRandomOrder()->first()->id
                ]);
                setPermissionsTeamId(null);
                $doctor->assignRole(RoleModel::where('name', 'Dokter')->first()->name);
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
                $admin->assignRole(RoleModel::where('name', 'Admin')->first()->name);
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
                $kasir->assignRole(RoleModel::where('name', 'Kasir')->first()->name);
            }
        }
    }
}
