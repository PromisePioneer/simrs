<?php

namespace Database\Seeders;

use Domains\MasterData\Infrastructure\Persistent\Models\DiseaseModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DiseaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenantId = DB::table('tenants')->value('id');

        // Sample ICD-10 codes — add more from the SIK dump as needed.
        // Columns: [code, name, symptoms, description, status, valid_code, accpdx, asterisk, im]
        $data = [
            ['A00', 'Kolera', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['A01', 'Tifoid dan paratifoid', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['A09', 'Diare dan gastroenteritis', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['A15', 'Tuberkulosis paru', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['A41', 'Sepsis', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['B20', 'HIV/AIDS', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['B24', 'Penyakit HIV unspecified', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['C50', 'Neoplasma payudara', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['D50', 'Anemia defisiensi besi', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['D64', 'Anemia lainnya', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['E10', 'Diabetes melitus tipe 1', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['E11', 'Diabetes melitus tipe 2', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['E13', 'Diabetes melitus lainnya', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['E14', 'Diabetes melitus unspecified', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['F20', 'Skizofrenia', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['G35', 'Multiple sclerosis', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['G40', 'Epilepsi', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['H00', 'Hordeolum dan kalazion', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['H10', 'Konjungtivitis', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['I10', 'Hipertensi primer / esensial', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['I20', 'Angina pektoris', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['I21', 'Infark miokard akut', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['I50', 'Gagal jantung', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['I63', 'Infark serebral / stroke', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['J00', 'Nasofaringitis akut / common cold', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['J06', 'ISPA unspecified', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['J18', 'Pneumonia unspecified', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['J44', 'PPOK', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['J45', 'Asma', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['K25', 'Tukak lambung', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['K29', 'Gastritis dan duodenitis', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['K35', 'Apendisitis akut', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['K80', 'Kolelithiasis / batu empedu', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['L20', 'Dermatitis atopik', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['M05', 'Artritis reumatoid', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['M54', 'Dorsalgia / nyeri punggung', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['N18', 'Penyakit ginjal kronik', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['N39', 'Infeksi saluran kemih', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['O80', 'Persalinan normal', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['P07', 'BBLR', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['R00', 'Abnormalitas denyut jantung', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['R05', 'Batuk', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['R50', 'Demam unspecified', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['R51', 'Sakit kepala', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['S00', 'Cedera superfisial kepala', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['T14', 'Cedera unspecified', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['U07.1', 'COVID-19 terkonfirmasi', null, null, 'infectious', '1', 'Y', '0', '0'],
            ['Z00', 'Pemeriksaan umum (MCU)', null, null, 'not_contagious', '1', 'Y', '0', '0'],
            ['Z13', 'Skrining penyakit lainnya', null, null, 'not_contagious', '1', 'Y', '0', '0'],
        ];

        $rows = [];
        foreach ($data as [$code, $name, $symptoms, $description, $status, $valid_code, $accpdx, $asterisk, $im]) {
            $rows[] = [
                'code' => $code,
                'name' => $name,
                'symptoms' => $symptoms,
                'description' => $description,
                'status' => $status,
                'valid_code' => $valid_code,
                'accpdx' => $accpdx,
                'asterisk' => $asterisk,
                'im' => $im,
                'tenant_id' => $tenantId,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        foreach ($rows as $row) {
            DiseaseModel::create($row);
        }

        $this->command->info('  Diseases (ICD-10): ' . count($rows) . ' records seeded.');
        $this->command->line('  <comment>Tip: Import the full penyakit dump from SIK for the complete ICD-10 dataset.</comment>');
    }
}
