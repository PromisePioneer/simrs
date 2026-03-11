<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\RoomType;
use App\Models\Tenant;
use App\Models\Ward;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Tenant::all()->each(function ($tenant) {
            for ($i = 0; $i < 100; $i++) {

                Room::create([
                    'tenant_id' => $tenant->id,
                    'ward_id' => Ward::all()->random()->id,
                    'room_type_id' => RoomType::all()->random()->id,
                    'room_number' => fake()->randomNumber(),
                    'name' => fake()->name(),
                    'capacity' => fake()->randomNumber(),
                ]);
            }
        });
    }
}
