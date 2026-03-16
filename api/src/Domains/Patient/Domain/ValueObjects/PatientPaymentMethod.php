<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object: Metode pembayaran pasien.
 *
 * Bisa self-pay, BPJS, atau asuransi lainnya.
 */
final class PatientPaymentMethod
{
    public function __construct(
        private readonly string  $paymentMethodTypeId,
        private readonly ?string $bpjsNumber = null,
    ) {
        $this->validate();
    }

    private function validate(): void
    {
        if (empty(trim($this->paymentMethodTypeId))) {
            throw new InvalidArgumentException('Payment method type tidak boleh kosong.');
        }
    }

    public static function fromArray(array $data): self
    {
        return new self(
            paymentMethodTypeId: $data['payment_method_type_id'],
            bpjsNumber:          $data['bpjs_number'] ?? null,
        );
    }

    public function paymentMethodTypeId(): string { return $this->paymentMethodTypeId; }
    public function bpjsNumber(): ?string          { return $this->bpjsNumber; }
    public function isBpjs(): bool                 { return $this->bpjsNumber !== null; }

    public function toArray(): array
    {
        return [
            'payment_method_type_id' => $this->paymentMethodTypeId,
            'bpjs_number'            => $this->bpjsNumber,
        ];
    }

    public function equals(self $other): bool
    {
        return $this->paymentMethodTypeId === $other->paymentMethodTypeId;
    }
}
