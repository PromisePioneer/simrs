<?php

declare(strict_types=1);

namespace Domains\Outpatient\Domain\Repository;

interface AppointmentRepositoryInterface
{
    public function findById(string $id): object;

    public function findAll(array $filters = [], ?int $perPage = null): object;

    public function findByVisitNumber(string $visitNumber): ?object;

    public function store(array $data): object;

    public function update(string $id, array $data): object;

    public function delete(string $id): void;
}
