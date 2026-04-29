<?php

declare(strict_types=1);

namespace Domains\Outpatient\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Visit number in SIK format: YYYY/MM/DD/XXXXXX
 *
 * Example: 2026/04/29/000001
 */
final class VisitNumber
{
    private const PATTERN = '/^\d{4}\/\d{2}\/\d{2}\/\d{6}$/';

    public readonly string $value;

    public function __construct(string $value)
    {
        if (! preg_match(self::PATTERN, $value)) {
            throw new InvalidArgumentException(
                "Invalid visit number format: [{$value}]. Expected YYYY/MM/DD/XXXXXX."
            );
        }

        $this->value = $value;
    }

    public static function fromString(string $value): self
    {
        return new self($value);
    }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string
    {
        return $this->value;
    }
}
