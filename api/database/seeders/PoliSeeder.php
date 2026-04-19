<?php

namespace Database\Seeders;

use Domains\MasterData\Infrastructure\Persistent\Models\PoliModel;
use Illuminate\Database\Seeder;

class PoliSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PoliModel::create([
            'name' => 'Poli Umum',
            'consultation_fee' => 100000,
        ]);

        PoliModel::create([
            'name' => 'Poli Gigi',
            'consultation_fee' => 150000,
        ]);

        PoliModel::create([
            'name' => 'Poli Kandungan',
            'consultation_fee' => 200000,
        ]);

        PoliModel::create([
            'name' => 'Poli Anak',
            'consultation_fee' => 150000,
        ]);
    }
}
