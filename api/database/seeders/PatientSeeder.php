<?php

namespace Database\Seeders;

use App\Models\Patient;
use App\Models\PatientPaymentMethod;
use App\Models\PatientAddress;
use App\Models\PaymentMethod;
use App\Models\PaymentMethodType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $tenantIds = \DB::table('tenants')->pluck('id')->toArray();

        if (empty($tenantIds)) {
            $this->command->warn('No tenants found. Please seed tenants first.');
            return;
        }

        $genders = ['pria', 'wanita'];
        $religions = ['islam', 'protestan', 'katholik', 'hindu', 'budha', 'konghucu'];
        $bloodTypes = ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-'];

        $cities = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Pekanbaru', 'Yogyakarta'];
        $jobs = ['Karyawan Swasta', 'PNS', 'Wiraswasta', 'Mahasiswa', 'Ibu Rumah Tangga', 'Dokter', 'Guru'];

        $provinces = [
            'DKI Jakarta' => ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat', 'Jakarta Utara'],
            'Jawa Barat' => ['Bandung', 'Bekasi', 'Bogor', 'Depok', 'Cimahi'],
            'Jawa Timur' => ['Surabaya', 'Malang', 'Sidoarjo', 'Gresik', 'Mojokerto'],
            'Riau' => ['Pekanbaru', 'Dumai', 'Bengkalis', 'Kampar', 'Rokan Hilir'],
        ];

        foreach (range(1, 50) as $index) {
            $tenantId = $tenantIds[array_rand($tenantIds)];
            $gender = $genders[array_rand($genders)];
            $province = array_rand($provinces);
            $city = $provinces[$province][array_rand($provinces[$province])];

            $patient = Patient::create([
                'tenant_id' => $tenantId,
                'full_name' => $this->generateName($gender),
                'medical_record_number' => 'MR' . date('Ymd') . str_pad($index, 4, '0', STR_PAD_LEFT),
                'city_of_birth' => $cities[array_rand($cities)],
                'date_of_birth' => now()->subYears(rand(18, 70))->subDays(rand(1, 365))->format('Y-m-d'),
                'id_card_number' => '32' . rand(10000000, 99999999) . rand(1000, 9999),
                'gender' => $gender,
                'religion' => $religions[array_rand($religions)],
                'blood_type' => rand(0, 1) ? $bloodTypes[array_rand($bloodTypes)] : null,
                'job' => $jobs[array_rand($jobs)],
                'phone' => '08' . rand(100000000, 999999999),
                'email' => 'patient' . $index . '@example.com',
                'date_of_consultation' => now()->subDays(rand(0, 30))->format('Y-m-d'),
                'profile_picture' => null,
            ]);

            $paymentMethodType = PaymentMethodType::inRandomOrder()->first();

            PatientPaymentMethod::create([
                'patient_id' => $patient->id,
                'payment_method_type_id' => $paymentMethodType->id,
                'bpjs_number' => rand(0, 1) ? 'BPJS' . rand(1000000, 9999999) : null,
            ]);

            PatientAddress::create([
                'patient_id' => $patient->id,
                'address' => 'Jl. ' . $this->generateStreetName() . ' No. ' . rand(1, 100),
                'province' => $province,
                'city' => $city,
                'subdistrict' => 'Kecamatan ' . $this->generateDistrictName(),
                'ward' => 'Kelurahan ' . $this->generateDistrictName(),
                'postal_code' => rand(10000, 99999),
            ]);
        }

    }

    private function generateName(string $gender): string
    {
        $maleFirstNames = ['Ahmad', 'Budi', 'Dedi', 'Eko', 'Fajar', 'Hadi', 'Joko', 'Rudi', 'Sandi', 'Wawan'];
        $femaleFirstNames = ['Ani', 'Dewi', 'Eka', 'Fitri', 'Indah', 'Lina', 'Nina', 'Ratna', 'Sari', 'Yuni'];
        $lastNames = ['Pratama', 'Wijaya', 'Santoso', 'Kusuma', 'Putra', 'Putri', 'Handoko', 'Setiawan', 'Wibowo', 'Permana'];

        $firstName = $gender === 'pria'
            ? $maleFirstNames[array_rand($maleFirstNames)]
            : $femaleFirstNames[array_rand($femaleFirstNames)];

        $lastName = $lastNames[array_rand($lastNames)];

        return $firstName . ' ' . $lastName;
    }

    private function generateStreetName(): string
    {
        $streets = [
            'Merdeka', 'Sudirman', 'Gatot Subroto', 'Ahmad Yani', 'Diponegoro',
            'Veteran', 'Pemuda', 'Pahlawan', 'Raya', 'Utama'
        ];

        return $streets[array_rand($streets)];
    }

    private function generateDistrictName(): string
    {
        $districts = [
            'Sukajadi', 'Buahbatu', 'Cibeunying', 'Bandung Wetan', 'Dago',
            'Cikini', 'Menteng', 'Tebet', 'Kemang', 'Senayan'
        ];

        return $districts[array_rand($districts)];
    }
}
