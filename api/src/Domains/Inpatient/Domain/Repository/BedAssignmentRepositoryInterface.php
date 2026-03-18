<?php

declare(strict_types=1);

namespace Domains\Inpatient\Domain\Repository;

interface BedAssignmentRepositoryInterface
{
    public function store(array $data): object;
    public function findCurrentAssignment(string $inpatientAdmissionId): ?object;
}
