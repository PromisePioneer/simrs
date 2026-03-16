<?php

declare(strict_types=1);

namespace Domains\Patient\Application\Commands;

use Domains\Patient\Application\DTO\UpdatePatientDTO;

/**
 * Command: Merepresentasikan intent "perbarui data pasien".
 */
final class UpdatePatientCommand
{
    public function __construct(
        public readonly UpdatePatientDTO $dto,
    ) {}
}
