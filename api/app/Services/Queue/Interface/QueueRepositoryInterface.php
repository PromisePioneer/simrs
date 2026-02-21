<?php

namespace App\Services\Queue\Interface;

interface QueueRepositoryInterface
{
    public function getQueues(array $filters = [], ?int $perPage = null): ?object;


    public function findById(string $id): ?object;


    public function store(array $data): ?object;

    public function update(array $data, string $id): ?object;

    public function destroy(string $id): ?bool;
}
