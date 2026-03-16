<?php

namespace Domains\IAM\Infrastructure\Persistence\Repositories;

use Domains\IAM\Domain\Repository\PoliRepositoryInterface;
use Domains\IAM\Domain\Repository\RegistrationInstitutionRepositoryInterface;
use Domains\IAM\Infrastructure\Persistence\Models\RegistrationInstitutionModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;

class EloquentRegistrationInstitutionRepository extends BaseEloquentRepository implements RegistrationInstitutionRepositoryInterface
{
    public function __construct()
    {
        parent::__construct(new RegistrationInstitutionModel());
    }


    public function applyFilters($query, array $filters)
    {
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                ->orWhere('type', 'like', '%' . $filters['search'] . '%');
        }

        return $query;
    }
}
