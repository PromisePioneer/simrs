<?php

namespace Domains\MasterData\Application\Services;

use Domains\MasterData\Domain\Repository\ProvinceRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class ProvinceService extends BaseCrudService
{
    public function __construct(ProvinceRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }
}
