<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\Exceptions;

use DomainException;

final class PatientNotFoundException extends DomainException
{
    public static function withId(string $id): self
    {
        return new self("Pasien dengan ID '{$id}' tidak ditemukan.");
    }

    public static function withMRN(string $mrn): self
    {
        return new self("Pasien dengan nomor rekam medis '{$mrn}' tidak ditemukan.");
    }
}
