<?php

declare(strict_types=1);

namespace Domains\Shared\Application\Services;

use Illuminate\Http\Request;

/**
 * Base Service untuk CRUD sederhana.
 *
 * Domain yang pure CRUD tinggal extend ini.
 * Domain yang kompleks (Patient, Outpatient) tidak extend ini —
 * mereka pakai Command/Handler pattern sendiri.
 *
 * Contoh:
 *
 *   class DegreeService extends BaseCrudService
 *   {
 *       public function __construct(DegreeRepositoryInterface $repository)
 *       {
 *           parent::__construct($repository);
 *       }
 *   }
 */
abstract class BaseCrudService
{
    public function __construct(
        protected readonly mixed $repository,
    )
    {
    }

    public function getAll(Request $request): object
    {
        $filters = $this->extractFilters($request);
        $perPage = $request->integer('per_page') ?: 15;

        return $this->repository->findAll($filters, $perPage);
    }

    public function findById(string $id): object
    {
        return $this->repository->findById($id);
    }

    public function store(array $data): object
    {
        return $this->repository->store($data);
    }

    public function update(string $id, array $data): object
    {
        return $this->repository->update($id, $data);
    }

    public function delete(string $id): void
    {
        $this->repository->delete($id);
    }


    protected function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }
}
