<?php

declare(strict_types=1);

namespace Domains\MasterData\Application\Services;

use Domains\MasterData\Domain\Repository\DepartmentRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class DepartmentService extends BaseCrudService
{
    public function __construct(DepartmentRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }
}
