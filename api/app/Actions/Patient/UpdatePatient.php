<?php

namespace App\Actions\Patient;

use App\Http\Requests\PatientRequest;
use App\Models\Patient;
use Throwable;

class UpdatePatient
{
    /**
     * @throws Throwable
     */
    public function execute(PatientRequest $request, Patient $patient): Patient
    {
        $data = $request->validated();
        $patient->update($data);
        return $patient;
    }
}
