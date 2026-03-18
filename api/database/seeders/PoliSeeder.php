<?php

namespace Database\Seeders;

use Domains\IAM\Infrastructure\Persistence\Models\PoliModel;
use Illuminate\Database\Seeder;

class PoliSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PoliModel::create([
            'name' => 'Poli Umum'
        ]);

        PoliModel::create([
            'name' => 'Poli Gigi'
        ]);

        PoliModel::create([
            'name' => 'Poli Kandungan'
        ]);

        PoliModel::create([
            'name' => 'Poli Anak'
        ]);
    }
}
