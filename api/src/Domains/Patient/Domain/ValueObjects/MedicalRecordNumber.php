<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object: Nomor rekam medis pasien.
 *
 * Immutable — tidak bisa diubah setelah dibuat.
 * Format: {TENANT_CODE}-{4 digit angka}  contoh: RSU-0001
 */
final class MedicalRecordNumber
{
    private string $value;

    private function __construct(string $value)
    {
        $this->validate($value);
        $this->value = strtoupper(trim($value));
    }

    public static function fromString(string $value): self
    {
        return new self($value);
    }

    /**
     * Generate nomor baru berdasarkan kode tenant dan nomor urut terakhir.
     */
    public static function generate(string $tenantCode, int $lastSequence): self
    {
        $sequence = str_pad((string) ($lastSequence + 1), 4, '0', STR_PAD_LEFT);
        return new self(strtoupper($tenantCode) . '-' . $sequence);
    }

    private function validate(string $value): void
    {
        if (empty(trim($value))) {
            throw new InvalidArgumentException('Medical record number tidak boleh kosong.');
        }

        // Format: PREFIX-NNNN  (minimal 6 char)
        if (strlen(trim($value)) < 6) {
            throw new InvalidArgumentException(
                "Medical record number '{$value}' tidak valid. Minimal 6 karakter."
            );
        }
    }

    public function value(): string
    {
        return $this->value;
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
