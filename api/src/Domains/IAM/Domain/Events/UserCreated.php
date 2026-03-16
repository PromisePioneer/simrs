<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Events;

final class UserCreated
{
    public function __construct(
        public readonly string  $userId,
        public readonly ?string $tenantId,
        public readonly string  $name,
        public readonly string  $email,
    ) {}
}
