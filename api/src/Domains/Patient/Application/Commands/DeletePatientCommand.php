<?php

declare(strict_types=1);

namespace Domains\Patient\Application\Commands;

/**
 * Command: Hapus pasien.
 */
final class DeletePatientCommand
{
    public function __construct(
        public readonly string $patientId,
        public readonly string $tenantId,
    ) {}
}
