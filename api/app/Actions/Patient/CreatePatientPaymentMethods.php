<?php

namespace App\Actions\Patient;

use App\Models\Patient;

class CreatePatientPaymentMethods
{
    public function execute(Patient $patient): Patient
    {
        if (!empty($data['payment_methods'])) {
            $patient->paymentMethods()->createMany($data['payment_methods']);
        }

        return $patient;
    }
}
