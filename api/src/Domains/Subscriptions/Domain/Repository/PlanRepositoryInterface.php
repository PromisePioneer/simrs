<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Domain\Repository;

interface PlanRepositoryInterface
{
    public function findAll(array $filters = [], ?int $perPage = null): object;

    public function findById(string $id): object;

    public function findBySlug(string $slug): ?object;

    public function store(array $data): object;

    public function update(string $id, array $data): object;

    public function delete(string $id): void;

    public function bulkDelete(array $ids): void;
}
