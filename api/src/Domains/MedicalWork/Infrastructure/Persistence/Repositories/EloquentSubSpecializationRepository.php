<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Infrastructure\Persistence\Repositories;

use Domains\MedicalWork\Domain\Repository\SubSpecializationRepositoryInterface;
use Domains\MedicalWork\Infrastructure\Persistence\Models\SubSpecializationModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentSubSpecializationRepository extends BaseEloquentRepository implements SubSpecializationRepositoryInterface
{
    public function __construct() { parent::__construct(new SubSpecializationModel()); }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }
        return $query;
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()->with('specialization')->orderBy('name');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : (object) $query->get();
    }

    public function findBySpecialization(string $specializationId, array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()
            ->where('specialization_id', $specializationId)
            ->orderBy('name');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
}
