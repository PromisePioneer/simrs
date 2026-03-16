<?php

declare(strict_types=1);

namespace Domains\Patient\Application\DTO;

/**
 * Data Transfer Object untuk update data pasien.
 */
final readonly class UpdatePatientDTO
{
    public function __construct(
        public string  $patientId,
        public string  $tenantId,
        public string  $fullName,
        public string  $cityOfBirth,
        public string  $dateOfBirth,
        public string  $idCardNumber,
        public string  $gender,
        public ?string $religion,
        public ?string $bloodType,
        public string  $job,
        public string  $phone,
        public ?string $email,
        public ?string $dateOfConsultation,
        public ?string $kisNumber,
        public ?string $profilePicturePath,
        public array   $addresses,
        public array   $paymentMethods,
    )
    {
    }
}
