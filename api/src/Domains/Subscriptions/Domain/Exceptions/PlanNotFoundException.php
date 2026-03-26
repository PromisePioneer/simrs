<?php

declare(strict_types=1);

namespace Domains\Subscriptions\Domain\Exceptions;

use RuntimeException;

final class PlanNotFoundException extends RuntimeException
{
    public static function withId(string $id): self
    {
        return new self("Plan dengan id [{$id}] tidak ditemukan.");
    }

    public static function withSlug(string $slug): self
    {
        return new self("Plan dengan slug [{$slug}] tidak ditemukan.");
    }
}
