<?php

declare(strict_types=1);

namespace Domains\IAM\Application\QueryHandlers;

use Domains\IAM\Application\Queries\GetUsersQuery;
use Domains\IAM\Domain\Repository\UserRepositoryInterface;

final readonly class GetUsersQueryHandler
{
    public function __construct(
        private UserRepositoryInterface $repository,
    )
    {
    }

    public function handle(GetUsersQuery $query): object
    {
        $filters = [];
        if ($query->search !== null) {
            $filters['search'] = $query->search;
        }

        return $this->repository->findAll(
            tenantId: $query->tenantId,
            filters: $filters,
            perPage: $query->perPage,
            role: $query->role,
        );
    }
}
