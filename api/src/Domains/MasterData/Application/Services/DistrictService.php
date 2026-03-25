<?php

namespace Domains\MasterData\Application\Services;

use Domains\MasterData\Domain\Repository\DistrictRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class DistrictService extends BaseCrudService
{
    public function __construct(DistrictRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }


    protected function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }
}
