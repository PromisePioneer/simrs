<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Infrastructure\Persistence\Repositories;

use Domains\MedicalWork\Domain\Repository\ProfessionRepositoryInterface;
use Domains\MedicalWork\Infrastructure\Persistence\Models\ProfessionModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentProfessionRepository extends BaseEloquentRepository implements ProfessionRepositoryInterface
{
    public function __construct() { parent::__construct(new ProfessionModel()); }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }
        return $query;
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()->with('specializations')->orderBy('name');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : (object) $query->get();
    }
}
