<?php

namespace Database\Seeders;

use App\Models\BedAssignment;
use App\Models\InpatientAdmission;
use App\Models\InpatientDailyCare;
use App\Models\InpatientPayment;
use App\Models\InpatientVitalSign;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class InpatientAdmissionSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = DB::table('tenants')->first();
        $doctors = DB::table('users')->limit(5)->get();
        $patients = DB::table('patients')->limit(20)->get();
        $beds = DB::table('beds')->limit(10)->get();

        if (!$tenant || $doctors->isEmpty() || $patients->isEmpty()) {
            $this->command->warn('Pastikan Tenant, User, dan Patient sudah ada.');
            return;
        }

        $admissionSources = ['IGD', 'Rawat Jalan', 'Rujukan'];
        $diagnoses = [
            'Demam Berdarah Dengue (DBD)',
            'Typhoid Fever',
            'Pneumonia',
            'Gastroenteritis Akut',
            'Hipertensi Grade II',
            'Diabetes Mellitus Tipe 2',
            'Appendisitis Akut',
            'Infeksi Saluran Kemih',
            'Stroke Iskemik',
            'Gagal Jantung Kongestif',
        ];

        $admissionsData = [
            ['status' => 'admitted', 'days_ago' => 2, 'discharged' => false],
            ['status' => 'admitted', 'days_ago' => 5, 'discharged' => false],
            ['status' => 'admitted', 'days_ago' => 1, 'discharged' => false],
            ['status' => 'discharged', 'days_ago' => 10, 'discharged' => true],
            ['status' => 'discharged', 'days_ago' => 15, 'discharged' => true],
            ['status' => 'discharged', 'days_ago' => 20, 'discharged' => true],
            ['status' => 'cancelled', 'days_ago' => 7, 'discharged' => false],
            ['status' => 'admitted', 'days_ago' => 3, 'discharged' => false],
            ['status' => 'discharged', 'days_ago' => 12, 'discharged' => true],
            ['status' => 'admitted', 'days_ago' => 6, 'discharged' => false],
        ];

        foreach ($admissionsData as $i => $data) {
            $patient = $patients[$i % count($patients)];
            $doctor = $doctors[$i % count($doctors)];
            $admittedAt = now()->subDays($data['days_ago']);
            $dischargedAt = $data['discharged']
                ? $admittedAt->copy()->addDays(rand(3, 7))
                : null;


            $inpatient = InpatientAdmission::create([
                'tenant_id' => $tenant->id,
                'patient_id' => $patient->id,
                'doctor_id' => $doctor->id,
                'admitted_at' => $admittedAt,
                'discharged_at' => $dischargedAt,
                'admission_source' => $admissionSources[array_rand($admissionSources)],
                'status' => $data['status'],
                'diagnosis' => $diagnoses[array_rand($diagnoses)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Bed Assignment
            if ($beds->isNotEmpty()) {
                $bed = $beds[$i % count($beds)];
                BedAssignment::create([
                    'inpatient_admission_id' => $inpatient->id,
                    'bed_id' => $bed->id,
                    'assigned_at' => $admittedAt,
                    'released_at' => $dischargedAt,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // Vital Signs
            foreach (range(1, rand(2, 3)) as $v) {
                InpatientVitalSign::create([
                    'id' => Str::uuid()->toString(),
                    'inpatient_admission_id' => $inpatient->id,
                    'temperature' => round(rand(365, 390) / 10, 1),
                    'pulse_rate' => rand(60, 110),
                    'respiratory_rate' => rand(16, 24),
                    'systolic' => rand(110, 160),
                    'diastolic' => rand(70, 100),
                    'created_at' => $admittedAt->copy()->addHours($v * 8),
                    'updated_at' => now(),
                ]);
            }

            // Daily Cares
            $days = $data['discharged']
                ? (int)$admittedAt->diffInDays($dischargedAt)
                : $data['days_ago'];

            foreach (range(0, min($days, 4)) as $d) {
                InpatientDailyCare::create([
                    'id' => Str::uuid()->toString(),
                    'inpatient_admission_id' => $inpatient->id,
                    'doctor_id' => $doctor->id,
                    'notes' => $this->randomNote(),
                    'created_at' => $admittedAt->copy()->addDays($d),
                    'updated_at' => now(),
                ]);
            }

            // Payment
            $subtotal = rand(500, 5000) * 1000;
            $tax = $subtotal * 0.11;


            InpatientPayment::create([
                'id' => Str::uuid()->toString(),
                'tenant_id' => $tenant->id,
                'inpatient_admission_id' => $inpatient->id,
                'invoice_number' => 'INV-' . strtoupper(Str::random(8)),
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $subtotal + $tax,
                'payment_status' => $data['status'] === 'discharged'
                    ? (rand(0, 1) ? 'paid' : 'unpaid')
                    : 'unpaid',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('Selesai. ' . count($admissionsData) . ' admisi berhasil dibuat.');
    }

    private function randomNote(): string
    {
        $notes = [
            'Pasien mengeluh nyeri kepala dan demam tinggi. Diberikan terapi cairan IV.',
            'Kondisi pasien membaik, nafsu makan mulai meningkat.',
            'Observasi ketat TTV setiap 4 jam. Tekanan darah masih fluktuatif.',
            'Pasien kooperatif, mengikuti program pengobatan dengan baik.',
            'Keluhan mual berkurang. Lanjutkan terapi sesuai rencana.',
            'Hasil lab menunjukkan perbaikan. Evaluasi ulang besok pagi.',
        ];

        return $notes[array_rand($notes)];
    }
}
