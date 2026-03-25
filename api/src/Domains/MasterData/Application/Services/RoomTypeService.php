<?php

namespace Domains\MasterData\Application\Services;

use Domains\MasterData\Domain\Repository\RoomTypeRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class RoomTypeService extends BaseCrudService
{
    public function __construct(RoomTypeRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    public function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }
}
