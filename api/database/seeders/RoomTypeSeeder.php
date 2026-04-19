<?php

namespace Database\Seeders;

use Domains\MasterData\Infrastructure\Persistent\Models\RoomTypeModel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoomTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        RoomTypeModel::insert([
            [
                'id' => Str::uuid()->toString(),
                'code' => 'VVIP',
                'name' => 'VVIP',
                'default_capacity' => 1,
                'rate_per_night' => 800000
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'VIP',
                'name' => 'VIP',
                'default_capacity' => 1,
                'rate_per_night' => 600000
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'KELAS_1',
                'name' => 'Kelas 1',
                'default_capacity' => 2,
                'rate_per_night' => 400000
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'KELAS_2',
                'name' => 'Kelas 2',
                'default_capacity' => 3,
                'rate_per_night' => 300000
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'KELAS_3',
                'name' => 'Kelas 3',
                'default_capacity' => 6,
                'rate_per_night' => 200000
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'ICU',
                'name' => 'ICU',
                'default_capacity' => 1,
                'rate_per_night' => 1000000
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'NICU',
                'name' => 'NICU',
                'default_capacity' => 1,
                'rate_per_night' => 1000000
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'HCU',
                'name' => 'HCU',
                'default_capacity' => 2,
                'rate_per_night' => 1000000
            ],
        ]);
    }
}
