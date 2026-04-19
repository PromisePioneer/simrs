<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Application\Services;

use Domains\Subscriptions\Domain\Repository\PlanRepositoryInterface;

class PlanService
{
    public function __construct(
        private readonly PlanRepositoryInterface $planRepository,
    ) {}

    public function getAll(array $filters = [], ?int $perPage = null): object
    {
        return $this->planRepository->findAll($filters, $perPage);
    }

    public function findById(string $id): object
    {
        return $this->planRepository->findById($id);
    }

    public function store(array $data): object
    {
        return $this->planRepository->store($data);
    }

    public function update(array $data, string $id): object
    {
        return $this->planRepository->update($data, $id);
    }

    public function delete(string $id): void
    {
        $this->planRepository->delete($id);
    }

    public function bulkDelete(array $ids): void
    {
        $this->planRepository->bulkDelete($ids);
    }
}
