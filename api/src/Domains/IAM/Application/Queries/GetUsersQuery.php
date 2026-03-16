<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Queries;

final readonly class GetUsersQuery
{
    public function __construct(
        public ?string $tenantId,
        public ?string $search = null,
        public ?int    $perPage = null,
        public ?string $role = null,
    )
    {
    }
}
