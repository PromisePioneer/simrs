<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\Events;

use DateTimeImmutable;

/**
 * Domain Event: Dipancarkan saat data pasien diperbarui.
 */
final class PatientUpdated
{
    public function __construct(
        public readonly string          $patientId,
        public readonly ?string          $tenantId,
        public readonly string          $fullName,
        public readonly DateTimeImmutable $occurredAt,
    ) {}
}
