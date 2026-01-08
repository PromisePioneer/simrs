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
                'code' => fake()->randomDigit(),
                'name' => 'Obat Bebas',
                'type' => 'medicine'
            ],
            [
                'code' => fake()->randomDigit(),
                'name' => 'Obat Bebas Terbatas',
                'type' => 'medicine'
            ],
            [
                'code' => fake()->randomDigit(),
                'name' => 'Obat Keras',
                'type' => 'medicine'
            ],
            [
                'code' => fake()->randomDigit(),
                'name' => 'Psikotropika',
                'type' => 'medicine'
            ],
            [
                'code' => fake()->randomDigit(),
                'name' => 'Narkotika',
                'type' => 'medicine'
            ],
        ];

        foreach ($data as $datum) {
            MedicineCategory::create($datum);
        }
    }
}
