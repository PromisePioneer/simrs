<?php

namespace Database\Seeders;

use Domains\MedicalWork\Infrastructure\Persistence\Models\ProfessionModel;
use Domains\MedicalWork\Infrastructure\Persistence\Models\SpecializationModel;
use Domains\MedicalWork\Infrastructure\Persistence\Models\SubSpecializationModel;
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
            $profession = ProfessionModel::create([
                'name' => $item['nama'],
                'description' => $item['nama_en']
            ]);

            if ($item['spesialis']) {
                foreach ($item['spesialis'] as $spesialis) {
                    $specialization = SpecializationModel::create([
                        'name' => $spesialis['nama'],
                        'description' => $spesialis['nama_en'],
                        'profession_id' => $profession->id
                    ]);

                    if ($spesialis['subspesialis']) {
                        foreach ($spesialis['subspesialis'] as $subSpesialis) {
                            SubSpecializationModel::create([
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
