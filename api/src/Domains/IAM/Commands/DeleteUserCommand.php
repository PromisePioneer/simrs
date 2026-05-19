<?php

declare(strict_types=1);

namespace Domains\IAM\Commands;

final class DeleteUserCommand
{
    /**
     * @param string[] $userIds
     */
    public function __construct(
        public readonly array $userIds,
    ) {}
}
