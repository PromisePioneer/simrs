<?php

namespace Domains\MasterData\Application\Services;

use Domains\MasterData\Domain\Repository\RegistrationInstitutionRepositoryInterface;
use Domains\MasterData\Infrastructure\Persistent\Models\RegistrationInstitutionModel;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class RegistrationInstitutionService extends BaseCrudService
{

    public function __construct(RegistrationInstitutionRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }


    public function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }


    public function bulkDelete(array $ids): void
    {
        RegistrationInstitutionModel::whereIn('id', $ids)->delete();
    }

}
