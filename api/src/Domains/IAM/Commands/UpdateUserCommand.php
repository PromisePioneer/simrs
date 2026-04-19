<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Commands;

use Domains\IAM\Application\DTO\UpdateUserDTO;

final class UpdateUserCommand
{
    public function __construct(public readonly UpdateUserDTO $dto) {}
}
