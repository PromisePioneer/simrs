<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object: Jenis kelamin pasien.
 */
final class Gender
{
    private const VALID = ['pria', 'wanita'];

    private function __construct(private readonly string $value) {}

    public static function pria(): self   { return new self('pria'); }
    public static function wanita(): self { return new self('wanita'); }

    public static function fromString(string $value): self
    {
        $normalized = strtolower(trim($value));
        if (!in_array($normalized, self::VALID, true)) {
            throw new InvalidArgumentException(
                "Gender '{$value}' tidak valid. Pilihan: " . implode(', ', self::VALID)
            );
        }
        return new self($normalized);
    }

    public function value(): string  { return $this->value; }
    public function isPria(): bool   { return $this->value === 'pria'; }
    public function isWanita(): bool { return $this->value === 'wanita'; }

    public function equals(self $other): bool
    {
        return $this->value === $other->value;
    }

    public function __toString(): string { return $this->value; }
}
