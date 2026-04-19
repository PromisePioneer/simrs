<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\Exceptions;

use DomainException;

final class PatientAlreadyExistsException extends DomainException
{
    public static function withNIK(string $nik): self
    {
        return new self("Pasien dengan NIK '{$nik}' sudah terdaftar dalam tenant ini.");
    }

    public static function withEmail(string $email): self
    {
        return new self("Pasien dengan email '{$email}' sudah terdaftar dalam tenant ini.");
    }
}
