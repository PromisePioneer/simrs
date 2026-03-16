<?php

declare(strict_types=1);

namespace Domains\IAM\Application\DTO;

/**
 * DTO untuk membuat user baru.
 * Password masih plain text — hashing dilakukan di Handler.
 */
final class CreateUserDTO
{
    public function __construct(
        public readonly ?string $tenantId,
        public readonly string  $name,
        public readonly string  $email,
        public readonly string  $password,
        public readonly ?string $phone,
        public readonly ?string $address,
        public readonly ?string $poliId,
        public readonly ?string $strInstitutionId,
        public readonly ?string $strRegistrationNumber,
        public readonly ?string $strActivePeriod,
        public readonly ?string $sipInstitutionId,
        public readonly ?string $sipRegistrationNumber,
        public readonly ?string $sipActivePeriod,
        public readonly ?string $signaturePath,
        public readonly ?string $profilePicturePath,
        public readonly array   $degrees,        // [['id' => ..., 'order' => ...]]
        public readonly array   $doctorSchedules, // [['day_of_week' => ..., 'start_time' => ..., 'end_time' => ...]]
        public readonly array   $roles,           // ['Admin', 'Dokter']
    ) {}
}
