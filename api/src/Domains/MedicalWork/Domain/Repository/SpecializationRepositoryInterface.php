<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Domain\Repository;

use Domains\Shared\Domain\Repository\BaseRepositoryInterface;

interface SpecializationRepositoryInterface extends BaseRepositoryInterface
{
    public function findByProfession(string $professionId, array $filters, ?int $perPage): object;
}
