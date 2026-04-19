<?php

namespace App\Traits\Patient;

use App\Models\Patient;
use App\Models\Tenant;

trait PatientManager
{
    public function generateMedicalRecordNumber(): string
    {
        $latestMedicalRecordNumber = Patient::latest()->first(['medical_record_number']);
        $tenant = Tenant::where('id', auth()->user()->tenant_id)->first();
        if ($latestMedicalRecordNumber) {
            $number = (int)substr($latestMedicalRecordNumber, 3);
            $number++;
            return $tenant?->code ?? "EMR-" . str_pad($number, 4, '0', STR_PAD_LEFT);
        }

        return $tenant?->code ?? "EMR-" . str_pad(1, 4, '0', STR_PAD_LEFT);
    }
}
