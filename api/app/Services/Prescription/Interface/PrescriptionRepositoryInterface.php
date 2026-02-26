<?php

namespace App\Services\Prescription\Interface;

interface PrescriptionRepositoryInterface
{
    public function getPrescriptions(array $filters = [], ?int $perPage = null);

    public function medicationDispensing(string $id);
}
