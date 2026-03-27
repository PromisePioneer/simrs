<?php

declare(strict_types=1);

namespace Domains\Shared\Infrastructure\Persistence\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Base Eloquent Repository.
 *
 * Semua repository sederhana extend ini.
 * Untuk repository kompleks (Patient), override method yang perlu saja.
 *
 * Contoh pemakaian:
 *
 *   class EloquentDegreeRepository extends BaseEloquentRepository
 *   {
 *       public function __construct()
 *       {
 *           parent::__construct(new DegreeModel());
 *       }
 *   }
 */
abstract class BaseEloquentRepository
{
    public function __construct(
        protected readonly Model $model,
    )
    {
    }

    public function findById(string $id): object
    {
        return $this->model->findOrFail($id);
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()->orderBy('created_at', 'desc');
        $query = $this->applyFilters($query, $filters);


        return $perPage ? $query->paginate($perPage) : $query->limit(10)->get();
    }

    public function store(array $data): object
    {
        return $this->model->create($data);
    }

    public function update(string $id, array $data): object
    {
        $record = $this->findById($id);
        $record->update($data);
        return $record->fresh();
    }

    public function delete(string $id): void
    {
        $this->findById($id)->delete();
    }

    /**
     * Override di subclass untuk tambah filter spesifik.
     *
     * Contoh:
     *   protected function applyFilters($query, array $filters)
     *   {
     *       if (!empty($filters['type'])) {
     *           $query->where('type', $filters['type']);
     *       }
     *       return parent::applyFilters($query, $filters);
     *   }
     */
    protected function applyFilters($query, array $filters)
    {
        return $query;
    }
}
