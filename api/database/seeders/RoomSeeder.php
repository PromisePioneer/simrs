<?php

namespace Database\Seeders;

use App\Models\Bed;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Tenant;
use App\Models\Ward;
use App\Services\Facilities\Bed\Service\BedService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */


    protected BedService $bedService;

    public function __construct()
    {
        $this->bedService = new BedService();
    }

    public function run(): void
    {
        Tenant::all()->each(function ($tenant) {
            for ($i = 0; $i < 100; $i++) {
                $room = Room::create([
                    'tenant_id' => $tenant->id,
                    'ward_id' => Ward::all()->random()->id,
                    'room_type_id' => RoomType::inRandomOrder()->first()->id,
                    'room_number' => fake()->randomNumber(),
                    'name' => fake()->name(),
                    'capacity' => fake()->randomNumber(),
                ]);

                 Bed::create([
                    'room_id' => $room->id,
                    'bed_number' => $this->bedService->generateBedNumber(roomId: $room->id),
                ]);
            }
        });
    }
}
