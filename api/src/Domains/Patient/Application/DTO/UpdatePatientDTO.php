<?php

declare(strict_types=1);

namespace Domains\Patient\Application\DTO;

/**
 * Data Transfer Object untuk update data pasien.
 */
final class UpdatePatientDTO
{
    public function __construct(
        public readonly string  $patientId,
        public readonly string  $tenantId,
        public readonly string  $fullName,
        public readonly string  $cityOfBirth,
        public readonly string  $dateOfBirth,
        public readonly string  $idCardNumber,
        public readonly string  $gender,
        public readonly ?string $religion,
        public readonly ?string $bloodType,
        public readonly string  $job,
        public readonly string  $phone,
        public readonly ?string $email,
        public readonly ?string $dateOfConsultation,
        public readonly ?string $kisNumber,
        public readonly ?string $profilePicturePath,
        public readonly array   $addresses,
        public readonly array   $paymentMethods,
    ) {}
}
