<?php

namespace Database\Seeders;

use App\Models\RoomType;
use App\Models\Tenant;
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
                'default_capacity' => 1
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'VIP',
                'name' => 'VIP',
                'default_capacity' => 1
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'KELAS_1',
                'name' => 'Kelas 1',
                'default_capacity' => 2
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'KELAS_2',
                'name' => 'Kelas 2',
                'default_capacity' => 3
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'KELAS_3',
                'name' => 'Kelas 3',
                'default_capacity' => 6
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'ICU',
                'name' => 'ICU',
                'default_capacity' => 1
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'NICU',
                'name' => 'NICU',
                'default_capacity' => 1
            ],
            [
                'id' => Str::uuid()->toString(),
                'code' => 'HCU',
                'name' => 'HCU',
                'default_capacity' => 2
            ],
        ]);
    }
}
