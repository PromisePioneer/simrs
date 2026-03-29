<?php

declare(strict_types=1);

namespace Domains\Clinical\Domain\Repository;

interface PrescriptionRepositoryInterface
{
    public function findById(string $id): object;

    public function findAll(array $filters = [], ?int $perPage = null): object;

    public function store(array $data): object;

    public function update(string $id, array $data): object;

    public function delete(string $id): void;
}
