<?php

namespace Database\Seeders;

use App\Models\Building;
use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BuildingSeeder extends Seeder
{
    public function run(): void
    {
        $buildings = [
            [
                'name' => 'Gedung Rawat Jalan',
                'description' => fake()->sentence(),
            ],
            [
                'name' => 'Gedung Rawat Inap',
                'description' => fake()->sentence(),
            ],
            [
                'name' => 'Gedung IGD',
                'description' => fake()->sentence(),
            ],
            [
                'name' => 'Gedung ICU',
                'description' => fake()->sentence(),
            ],
            [
                'name' => 'Gedung Penunjang Medis',
                'description' => fake()->sentence(),
            ],
        ];

        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {

            $data = collect($buildings)->map(function ($building) use ($tenant) {
                return [
                    'id' => Str::uuid()->toString(),
                    'tenant_id' => $tenant->id,
                    'name' => $building['name'],
                    'description' => $building['description'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            })->toArray();

            Building::insert($data);
        }
    }
}
