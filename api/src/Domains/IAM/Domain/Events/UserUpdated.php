<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Events;

final class UserUpdated
{
    public function __construct(
        public readonly string  $userId,
        public readonly ?string $tenantId,
        public readonly string  $name,
    ) {}
}
