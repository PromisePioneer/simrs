<?php

namespace Database\Seeders;

use Domains\Facility\Infrastructure\Persistence\Models\BuildingModel;
use Domains\Facility\Infrastructure\Persistence\Models\WardModel;
use Domains\MasterData\Infrastructure\Persistent\Models\DepartmentModel;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Illuminate\Database\Seeder;

class WardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenants = TenantModel::all();
        foreach ($tenants as $tenant) {
            for ($i = 0; $i <= 5; $i++) {
                WardModel::create([
                    'tenant_id' => $tenant->id,
                    'building_id' => BuildingModel::inRandomOrder()->first()->id,
                    'department_id' => DepartmentModel::inRandomOrder()->first()->id,
                    'name' => fake()->firstName(),
                    'floor' => fake()->randomNumber(),
                ]);
            }
        }
    }
}
