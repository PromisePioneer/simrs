<?php

namespace Domains\MasterData\Infrastructure\Persistent\Repositories;

use Domains\MasterData\Domain\Repository\RegistrationInstitutionRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\RegistrationInstitutionModel;
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
