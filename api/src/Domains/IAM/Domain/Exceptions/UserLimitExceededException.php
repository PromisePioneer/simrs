<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Exceptions;

use DomainException;

final class UserLimitExceededException extends DomainException
{
    public static function forPlan(string $planName, int $maxUsers): self
    {
        return new self(
            "Batas maksimal pengguna untuk paket {$planName} adalah {$maxUsers} pengguna. " .
            "Upgrade paket untuk menambah lebih banyak pengguna."
        );
    }
}
