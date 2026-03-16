<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Exceptions;

use DomainException;

final class UserNotFoundException extends DomainException
{
    public static function withId(string $id): self
    {
        return new self("User dengan ID '{$id}' tidak ditemukan.");
    }
}
