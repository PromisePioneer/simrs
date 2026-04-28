<?php

namespace Domains\MasterData\Application\Services;

use Domains\MasterData\Domain\Repository\DiseaseRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class DiseaseService extends BaseCrudService
{
    public function __construct(DiseaseRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }


    protected function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }


}
