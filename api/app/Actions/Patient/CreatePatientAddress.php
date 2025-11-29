<?php

namespace App\Actions\Patient;

use App\Models\Patient;

class CreatePatientAddress
{
    public function execute(Patient $patient): Patient
    {
        if (!empty($data['addresses'])) {
            $patient->addresses()->createMany($data['addresses']);
        }

        return $patient;
    }
}
