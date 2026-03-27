<?php

declare(strict_types=1);

namespace Domains\Outpatient\Domain\Repository;

interface QueueRepositoryInterface
{
    public function findById(string $id): object;
    public function findAll(array $filters = [], ?int $perPage = null): object;
    public function store(array $data): object;
    public function update(array $data, string $id): object;
    public function delete(string $id): void;
    public function countTodayQueues(string $today): int;
}
