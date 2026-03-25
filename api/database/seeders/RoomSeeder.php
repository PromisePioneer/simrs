<?php

namespace Database\Seeders;

use App\Models\Bed;
use App\Models\Room;
use App\Models\RoomType;
use App\Models\Tenant;
use App\Models\Ward;
use App\Services\Facilities\Bed\Service\BedService;
use Domains\Facility\Infrastructure\Persistence\Models\BedModel;
use Domains\Facility\Infrastructure\Persistence\Models\RoomModel;
use Domains\Facility\Infrastructure\Persistence\Models\WardModel;
use Domains\MasterData\Infrastructure\Persistent\Models\RoomTypeModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();
        $wards = WardModel::all();
        $roomTypes = RoomTypeModel::pluck('id');
        $tenants->each(function ($tenant) use ($wards, $roomTypes) {
            for ($i = 0; $i < 3; $i++) {
                foreach ($wards as $ward) {
                    $room = RoomModel::create([
                        'tenant_id' => $tenant->id,
                        'ward_id' => $ward->id,
                        'room_type_id' => $roomTypes->random(),
                        'room_number' => fake()->randomNumber(),
                        'name' => fake()->name(),
                        'capacity' => random_int(1, 5),
                    ]);

                    $beds = [];
                    for ($j = 0; $j < $room->capacity; $j++) {
                        $beds[] = [
                            'id' => Str::orderedUuid(),
                            'room_id' => $room->id,
                            'bed_number' => fake()->randomNumber(),
                            'status' => 'available',
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    BedModel::insert($beds);
                }
            }
        });
    }
}
