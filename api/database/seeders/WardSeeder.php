<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Department;
use App\Models\Tenant;
use App\Models\Ward;
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
            for ($i = 0; $i < 100; $i++) {
                Ward::create([
                    'tenant_id' => $tenant->id,
                    'building_id' => Building::inRandomOrder()->first()->id,
                    'department_id' => Department::inRandomOrder()->first()->id,
                    'name' => fake()->firstName(),
                    'floor' => fake()->randomNumber(),
                ]);
            }
        }
    }
}
