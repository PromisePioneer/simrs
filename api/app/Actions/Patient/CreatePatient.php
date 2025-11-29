<?php

namespace App\Actions\Patient;

use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use App\Traits\Patient\PatientManager;

class CreatePatient
{
    use PatientManager;

    public function execute(PatientRequest $request): Patient
    {
        $data = $request->validated();
        $data['medical_record_number'] = $this->generateMedicalRecordNumber();
        $data['date_of_consultation'] = $request->date_of_consultation ?? now()->format('Y-m-d');
        return Patient::create($data);
    }
}
