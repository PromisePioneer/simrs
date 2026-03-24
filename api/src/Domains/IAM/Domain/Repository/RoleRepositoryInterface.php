<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Repository;

use Domains\Shared\Domain\Repository\BaseRepositoryInterface;
use Illuminate\Support\Collection;

interface RoleRepositoryInterface extends BaseRepositoryInterface
{
    public function getByTenant(string $tenantId): Collection;
}
