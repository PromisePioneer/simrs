<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Services;

use Domains\IAM\Domain\Repository\DegreeRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class DegreeService extends BaseCrudService
{
    public function __construct(DegreeRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function extractFilters(Request $request): array
    {
        return $request->only(['search', 'type']);
    }
}
