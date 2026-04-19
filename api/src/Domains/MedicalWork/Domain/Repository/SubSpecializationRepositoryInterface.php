<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Domain\Repository;

use Domains\Shared\Domain\Repository\BaseRepositoryInterface;

interface SubSpecializationRepositoryInterface extends BaseRepositoryInterface
{
    public function findBySpecialization(string $specializationId, array $filters, ?int $perPage): object;
}
