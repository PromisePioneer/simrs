<?php

namespace App\Services\Inpatient\BedAssignment\Interface;

interface BedAssignmentInterface
{
    public function store(array $data): object;
}
