<?php

namespace App\Services\Inpatient\VitalSign\Interface;

interface InpatientVitalSignInterface
{
    public function store(array $data): object;
}
