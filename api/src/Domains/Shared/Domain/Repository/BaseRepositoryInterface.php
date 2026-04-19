<?php

declare(strict_types=1);

namespace Domains\Shared\Domain\Repository;

interface BaseRepositoryInterface
{
    public function findById(string $id): object;

    public function findAll(array $filters = [], ?int $perPage = null): object;

    public function store(array $data): object;

    public function update(string $id, array $data): object;

    public function delete(string $id): void;
}
