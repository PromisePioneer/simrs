<?php

namespace Database\Seeders;

use App\Models\RegistrationInstitution;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RegistrationInstitutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'name' => 'Konsil Kedokteran Indonesia',
                'type' => 'str',
            ],
            [
                'name' => 'Majelis Tenaga Kesehatan Provinsi',
                'type' => 'str',
            ],
            [
                'name' => 'Majelis Tenaga Kesehatan Indonesia',
                'type' => 'str',
            ],
            [
                'name' => 'Himpunan Psikologi Indonesia',
                'type' => 'str',
            ],
            [
                'name' => 'Ikatan Fisioterapi Indonesia',
                'type' => 'str',
            ],
            [
                'name' => 'Perhimpunan Dokter Hewan Indonesia',
                'type' => 'str',
            ],
            [
                'name' => 'Ikatan Okupasi Terapi Indonesia',
                'type' => 'str',
            ],
            [
                'name' => 'Ikatan Psikologi Klinis Indonesia',
                'type' => 'str',
            ],
            [
                'name' => 'Ikatan Sinse Indonesia',
                'type' => 'str',
            ],
            [
                'name' => 'Komisi Farmasi Nasional',
                'type' => 'str',
            ],
            [
                'name' => 'Dinas Kesehatan Provinsi',
                'type' => 'str',
            ],
            [
                'name' => 'PTGMI',
                'type' => 'str',
            ],
            [
                'name' => 'Konsil Tenaga Kesehatan Gigi Indonesia (KTKGI)',
                'type' => 'str',
            ],
            [
                'name' => 'Konsil Tenaga Kesehatan Indonesia (KTKI)',
                'type' => 'str',
            ],
            [
                'name' => 'Konsil Kesehatan Indonesia',
                'type' => 'str',
            ],
            [
                'name' => 'Ikatan Dokter Indonesia (IDI)',
                'type' => 'sip',
            ],
            [
                'name' => 'Persatuan Dokter Gigi Indonesia (PDGI)',
                'type' => 'sip',
            ],
            [
                'name' => 'Dinas Kesehatan Daerah',
                'type' => 'sip',
            ],
            [
                'name' => 'Dinas Kesehatan Kabupaten',
                'type' => 'sip',
            ],
            [
                'name' => 'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Kabupaten',
                'type' => 'sip',
            ],
            [
                'name' => 'DPC PTGMI Daerah',
                'type' => 'sip',
            ],
            [
                'name' => 'Ikatan Bidan Indonesia (IBI)',
                'type' => 'sip',
            ],
            [
                'name' => 'Persatuan Perawat Nasional Indonesia (PPNI)',
                'type' => 'sip',
            ],
            [
                'name' => 'Persatuan Ahli Teknologi Laboratorium (PATELKI)',
                'type' => 'sip',
            ],
            [
                'name' => 'Ikatan Apoteker Indonesia (IAI)',
                'type' => 'sip',
            ],
        ];


        foreach ($data as $item) {
            RegistrationInstitution::create($item);
        }
    }
}
