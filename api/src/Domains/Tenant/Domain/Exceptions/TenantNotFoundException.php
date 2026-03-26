<?php

declare(strict_types=1);

namespace Domains\Tenant\Domain\Exceptions;

use RuntimeException;

class TenantNotFoundException extends RuntimeException
{
    public function __construct(string $id)
    {
        parent::__construct("Tenant with ID [{$id}] not found.");
    }
}
