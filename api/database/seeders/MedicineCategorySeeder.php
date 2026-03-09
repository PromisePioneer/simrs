<?php

namespace Database\Seeders;

use App\Models\MedicineCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MedicineCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Obat Bebas',
                'type' => 'medicine'
            ],
            [
                'name' => 'Obat Bebas Terbatas',
                'type' => 'medicine'
            ],
            [
                'name' => 'Obat Keras',
                'type' => 'medicine'
            ],
            [
                'name' => 'Psikotropika',
                'type' => 'medicine'
            ],
            [
                'name' => 'Narkotika',
                'type' => 'medicine'
            ],
        ];

        foreach ($data as $datum) {
            MedicineCategory::create($datum);
        }
    }
}
