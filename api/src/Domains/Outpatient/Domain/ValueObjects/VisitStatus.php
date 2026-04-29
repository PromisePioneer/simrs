<?php

declare(strict_types=1);

namespace Domains\Outpatient\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Wraps the appointment status enum.
 *
 * Allowed values mirror the migration enum:
 *   not_yet | already | canceled | files_received |
 *   refered | died | in_treatment | forced_return
 */
final class VisitStatus
{
    public const NOT_YET        = 'not_yet';
    public const ALREADY        = 'already';
    public const CANCELED       = 'canceled';
    public const FILES_RECEIVED = 'files_received';
    public const REFERED        = 'refered';
    public const DIED           = 'died';
    public const IN_TREATMENT   = 'in_treatment';
    public const FORCED_RETURN  = 'forced_return';

    public const ALL = [
        self::NOT_YET,
        self::ALREADY,
        self::CANCELED,
        self::FILES_RECEIVED,
        self::REFERED,
        self::DIED,
        self::IN_TREATMENT,
        self::FORCED_RETURN,
    ];

    public readonly string $value;

    public function __construct(string $value)
    {
        if (! in_array($value, self::ALL, true)) {
            throw new InvalidArgumentException(
                "Invalid visit status: [{$value}]. Allowed: " . implode(', ', self::ALL)
            );
        }

        $this->value = $value;
    }

    public static function notYet(): self        { return new self(self::NOT_YET); }
    public static function inTreatment(): self   { return new self(self::IN_TREATMENT); }
    public static function canceled(): self      { return new self(self::CANCELED); }

    public function isActive(): bool
    {
        return in_array($this->value, [self::NOT_YET, self::IN_TREATMENT], true);
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
