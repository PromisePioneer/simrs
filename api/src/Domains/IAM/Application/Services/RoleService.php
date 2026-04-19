<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Services;

use Domains\IAM\Domain\Repository\RoleRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

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


    public function getByTenant(string $tenantId): Collection
    {
        return $this->repository->getByTenant($tenantId);
    }
}
