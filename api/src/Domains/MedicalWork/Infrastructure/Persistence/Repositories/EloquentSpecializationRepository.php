<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Infrastructure\Persistence\Repositories;

use Domains\MedicalWork\Domain\Repository\SpecializationRepositoryInterface;
use Domains\MedicalWork\Infrastructure\Persistence\Models\SpecializationModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentSpecializationRepository extends BaseEloquentRepository implements SpecializationRepositoryInterface
{
    public function __construct() { parent::__construct(new SpecializationModel()); }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }
        return $query;
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()->with('profession')->orderBy('name');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : (object) $query->get();
    }

    public function findByProfession(string $professionId, array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()
            ->where('profession_id', $professionId)
            ->with(['profession', 'subSpecializations'])
            ->orderBy('name');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : $query->get();
    }
}
