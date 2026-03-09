<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Tenant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BuildingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $tenants = Tenant::all();


        foreach ($tenants as $tenant) {
            for ($i = 0; $i < 10; $i++) {
                Building::create([
                    'tenant_id' => $tenant->id,
                    'name' => fake()->buildingNumber(),
                    'description' => fake()->sentence(),
                ]);
            }
        }
    }
}
