<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object: Gelar user (prefix/suffix).
 */
final class UserDegree
{
    public function __construct(
        private readonly string $degreeId,
        private readonly string $degreeName,
        private readonly string $type,   // prefix | suffix
        private readonly int    $order,
    ) {
        if (!in_array($type, ['prefix', 'suffix'], true)) {
            throw new InvalidArgumentException("Tipe gelar tidak valid: {$type}");
        }
    }

    public static function fromArray(array $data): self
    {
        return new self(
            degreeId:   $data['id'],
            degreeName: $data['name'],
            type:       $data['type'],
            order:      $data['order'] ?? 0,
        );
    }

    public function degreeId(): string   { return $this->degreeId; }
    public function degreeName(): string { return $this->degreeName; }
    public function type(): string       { return $this->type; }
    public function order(): int         { return $this->order; }
    public function isPrefix(): bool     { return $this->type === 'prefix'; }
    public function isSuffix(): bool     { return $this->type === 'suffix'; }

    public function toSyncData(): array
    {
        return [$this->degreeId => ['order' => $this->order]];
    }
}
