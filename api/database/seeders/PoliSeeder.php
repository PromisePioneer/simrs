<?php

namespace Database\Seeders;

use App\Models\Poli;
use Illuminate\Database\Seeder;

class PoliSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Poli::create([
            'name' => 'Poli Umum'
        ]);

        Poli::create([
            'name' => 'Poli Gigi'
        ]);

        Poli::create([
            'name' => 'Poli Kandungan'
        ]);

        Poli::create([
            'name' => 'Poli Anak'
        ]);
    }
}
