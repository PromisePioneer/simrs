<?php

declare(strict_types=1);

namespace Domains\Inpatient\Domain\Repository;

interface InpatientVitalSignRepositoryInterface
{
    public function store(array $data): object;
}
