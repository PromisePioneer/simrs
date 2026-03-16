<?php

namespace Domains\IAM\Application\Services;

use Domains\IAM\Domain\Repository\RoleRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class RoleService extends BaseCrudService
{
    public function __construct(RoleRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }


    public function extractFilters(Request $request): array
    {
        return $request->only(['search']);
    }
}
