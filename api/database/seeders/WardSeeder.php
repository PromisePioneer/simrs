<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Department;
use App\Models\Tenant;
use App\Models\Ward;
use Domains\Facility\Infrastructure\Persistence\Models\BuildingModel;
use Domains\Facility\Infrastructure\Persistence\Models\WardModel;
use Domains\IAM\Infrastructure\Persistence\Models\DepartmentModel;
use Illuminate\Database\Seeder;

class WardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenants = Tenant::all();
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
