<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\ValueObjects;

use InvalidArgumentException;

/**
 * Value Object: Alamat lengkap pasien.
 *
 * Immutable. Satu pasien bisa punya banyak PatientAddress.
 */
final readonly class PatientAddress
{
    public function __construct(
        private string $address,
        private string $province,
        private string $city,
        private string $subdistrict,
        private string $ward,
        private string $postalCode,
    )
    {
        $this->validate();
    }

    private function validate(): void
    {
        if (empty(trim($this->address))) {
            throw new InvalidArgumentException('Alamat tidak boleh kosong.');
        }
        if (empty(trim($this->province))) {
            throw new InvalidArgumentException('Provinsi tidak boleh kosong.');
        }
        if (empty(trim($this->city))) {
            throw new InvalidArgumentException('Kota tidak boleh kosong.');
        }
        if (empty(trim($this->subdistrict))) {
            throw new InvalidArgumentException('Kecamatan tidak boleh kosong.');
        }
        if (empty(trim($this->ward))) {
            throw new InvalidArgumentException('Kelurahan tidak boleh kosong.');
        }
        if (empty(trim($this->postalCode))) {
            throw new InvalidArgumentException('Kode pos tidak boleh kosong.');
        }
    }

    public static function fromArray(array $data): self
    {
        return new self(
            address: $data['address'],
            province: $data['province'],
            city: $data['city'],
            subdistrict: $data['subdistrict'],
            ward: $data['ward'],
            postalCode: $data['postal_code'],
        );
    }

    public function address(): string
    {
        return $this->address;
    }

    public function province(): string
    {
        return $this->province;
    }

    public function city(): string
    {
        return $this->city;
    }

    public function subdistrict(): string
    {
        return $this->subdistrict;
    }

    public function ward(): string
    {
        return $this->ward;
    }

    public function postalCode(): string
    {
        return $this->postalCode;
    }

    public function toArray(): array
    {
        return [
            'address' => $this->address,
            'province' => $this->province,
            'city' => $this->city,
            'subdistrict' => $this->subdistrict,
            'ward' => $this->ward,
            'postal_code' => $this->postalCode,
        ];
    }

    public function equals(self $other): bool
    {
        return $this->toArray() === $other->toArray();
    }
}
