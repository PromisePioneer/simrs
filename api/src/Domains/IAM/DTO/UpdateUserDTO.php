<?php

declare(strict_types=1);

namespace Domains\IAM\Application\DTO;

final class UpdateUserDTO
{
    public function __construct(
        public readonly string  $userId,
        public readonly ?string $tenantId,
        public readonly string  $name,
        public readonly string  $email,
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
        public readonly array   $degrees,
        public readonly array   $doctorSchedules,
        public readonly array   $roles,
    ) {}
}
