<?php

declare(strict_types=1);

namespace Domains\IAM\DTO;

/**
 * DTO untuk membuat user baru.
 * Password masih plain text — hashing dilakukan di Handler.
 */
final readonly class CreateUserDTO
{
    public function __construct(
        public ?string $tenantId,
        public string  $name,
        public string  $email,
        public string  $password,
        public ?string $phone,
        public ?string $address,
        public ?string $poliId,
        public ?string $strInstitutionId,
        public ?string $strRegistrationNumber,
        public ?string $strActivePeriod,
        public ?string $sipInstitutionId,
        public ?string $sipRegistrationNumber,
        public ?string $sipActivePeriod,
        public ?string $signaturePath,
        public ?string $profilePicturePath,
        public array   $degrees,
        public array   $doctorSchedules,
        public array   $roles,
    )
    {
    }
}
