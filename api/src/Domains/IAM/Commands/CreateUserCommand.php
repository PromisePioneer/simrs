<?php

declare(strict_types=1);

namespace Domains\IAM\Application\Commands;

use Domains\IAM\Application\DTO\CreateUserDTO;

final class CreateUserCommand
{
    public function __construct(public readonly CreateUserDTO $dto) {}
}
