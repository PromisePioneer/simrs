<?php

declare(strict_types=1);

namespace Domains\Patient\Application\Commands;

use Domains\Patient\Application\DTO\RegisterPatientDTO;

/**
 * Command: Merepresentasikan intent "daftarkan pasien baru".
 *
 * Command adalah immutable message yang berisi semua data
 * yang dibutuhkan untuk menjalankan satu use case.
 */
final class RegisterPatientCommand
{
    public function __construct(
        public readonly RegisterPatientDTO $dto,
    ) {}
}
