<?php

namespace Database\Seeders;

use App\Models\PaymentMethodType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentMethodTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Asuransi',
            ],
            [
                'name' => 'BPJS',
            ],
            [
                'name' => 'Kartu Debit',
            ],
            [
                'name' => 'Kartu Kredit',
            ],
            [
                'name' => 'Langsung',
            ],
            [
                'name' => 'Perusahaan',
            ],
            [
                'name' => 'Tunai',
            ]
        ];

        foreach ($types as $type) {
            PaymentMethodType::create($type);
        }
    }
}
