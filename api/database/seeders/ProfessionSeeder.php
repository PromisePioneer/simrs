<?php

namespace Database\Seeders;

use App\Models\Profession;
use App\Models\Specialization;
use App\Models\SubSpecialization;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProfessionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = public_path('json/profession.json');
        $data = json_decode(file_get_contents($path), true);

        foreach ($data as $item) {
            $profession = Profession::create([
                'name' => $item['nama'],
                'description' => $item['nama_en']
            ]);

            if ($item['spesialis']) {
                foreach ($item['spesialis'] as $spesialis) {
                    $specialization = Specialization::create([
                        'name' => $spesialis['nama'],
                        'description' => $spesialis['nama_en'],
                        'profession_id' => $profession->id
                    ]);

                    if ($spesialis['subspesialis']) {
                        foreach ($spesialis['subspesialis'] as $subSpesialis) {
                            SubSpecialization::create([
                                'name' => $subSpesialis['nama'],
                                'description' => $subSpesialis['nama_en'],
                                'specialization_id' => $specialization->id
                            ]);
                        }
                    }
                }
            }
        }
    }
}
