<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use Domains\IAM\Domain\Repository\DegreeRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\DegreeModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

/**
 * Extend BaseEloquentRepository.
 * Semua CRUD sudah ada di base — tinggal tambah filter spesifik.
 */
class EloquentDegreeRepository extends BaseEloquentRepository implements DegreeRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new DegreeModel());
    }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        return $query;
    }
}
