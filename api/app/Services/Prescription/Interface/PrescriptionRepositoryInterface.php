<?php

namespace App\Services\Prescription\Interface;

interface PrescriptionRepositoryInterface
{
    public function getPrescriptions(array $filters = [], int $perPage = 20);

    public function medicationDispensing();
}
