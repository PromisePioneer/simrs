<?php

namespace Database\Seeders;

use App\Models\RoomType;
use App\Models\Tenant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenants = Tenant::all();


        foreach ($tenants as $tenant) {

            for ($i = 0; $i < 10; $i++) {
                RoomType::create([
                    'tenant_id' => $tenant->id,
                    'code' => fake()->currencyCode(),
                    'name' => fake()->firstName(gender: "male"),
                    'default_capacity' => fake()->randomNumber()
                ]);
            }
        }

    }
}
