<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\Services;

use Domains\Outpatient\Domain\Repository\OutpatientVisitRepositoryInterface;
use Illuminate\Http\Request;

final class OutpatientVisitService
{
    public function __construct(
        private readonly OutpatientVisitRepositoryInterface $repo,
    ) {}

    public function getAll(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page') ? (int) $request->input('per_page') : null;
        $status  = $request->input('status', 'waiting');
        return $this->repo->findAll($filters, $perPage, $status);
    }

    public function findById(string $id): object
    {
        return $this->repo->findById($id);
    }

    public function store(array $data): object
    {
        return $this->repo->store($data);
    }

    public function update(array $data, string $id): object
    {
        return $this->repo->update($data, $id);
    }

    public function destroy(string $id): bool
    {
        return $this->repo->delete($id);
    }

    public function getTodayPatientCount(): array
    {
        return $this->repo->countPatientVisit(now()->toDateString(), now()->subDay()->toDateString());
    }

    public function getPatientBasedOnStatusCount(): array
    {
        return $this->repo->getPatientBasedOnStatusCount(now()->toDateString());
    }
}
