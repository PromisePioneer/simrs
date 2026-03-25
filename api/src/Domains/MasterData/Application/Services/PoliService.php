<?php

namespace Domains\MasterData\Application\Services;

use Domains\MasterData\Domain\Repository\PoliRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class PoliService extends BaseCrudService
{

    public function __construct(PoliRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }


    public function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }

}
