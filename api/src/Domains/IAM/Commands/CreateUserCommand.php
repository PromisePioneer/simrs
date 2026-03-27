<?php

declare(strict_types=1);

namespace Domains\IAM\Commands;

use Domains\IAM\DTO\CreateUserDTO;

final readonly class CreateUserCommand
{
    public function __construct(public CreateUserDTO $dto)
    {
    }
}
