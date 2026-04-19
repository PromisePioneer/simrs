<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Commands;

final class DeleteUserCommand
{
    public function __construct(
        public readonly string $userId,
    ) {}
}
