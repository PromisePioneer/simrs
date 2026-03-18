<?php

declare(strict_types=1);

namespace Domains\Clinical\Domain\Repository;

interface DiagnoseRepositoryInterface
{
    public function store(array $data): object;
    public function findByVisit(string $visitId): object;
}
