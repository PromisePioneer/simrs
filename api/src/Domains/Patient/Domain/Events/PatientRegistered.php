<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\Events;

use DateTimeImmutable;

/**
 * Domain Event: Dipancarkan saat pasien baru berhasil didaftarkan.
 *
 * Event ini bisa didengar oleh:
 * - Notifikasi email ke admin
 * - Audit log
 * - Sinkronisasi ke sistem lain
 */
final readonly class PatientRegistered
{
    public function __construct(
        public string           $patientId,
        public ?string            $tenantId,
        public string            $medicalRecordNumber,
        public string            $fullName,
        public DateTimeImmutable $occurredAt,
    )
    {
    }
}
