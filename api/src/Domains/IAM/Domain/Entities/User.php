<?php

declare(strict_types=1);

namespace Domains\IAM\Domain\Entities;

use Domains\IAM\Domain\Events\UserCreated;
use Domains\IAM\Domain\Events\UserUpdated;
use Domains\IAM\Domain\ValueObjects\UserDegree;
use Domains\IAM\Domain\ValueObjects\DoctorSchedule;
use InvalidArgumentException;

/**
 * Aggregate Root: User
 *
 * Merepresentasikan user dalam sistem SIMRS.
 * Mengorkestrasi degree, role, dan doctor schedule.
 *
 * TIDAK extend Eloquent — murni PHP.
 */
final class User
{
    private array $domainEvents = [];

    /** @var UserDegree[] */
    private array $degrees;

    /** @var DoctorSchedule[] */
    private array $doctorSchedules;

    /** @var string[] role names */
    private array $roles;

    private function __construct(
        private readonly string  $id,
        private readonly ?string $tenantId,
        private string           $name,
        private string           $email,
        private ?string          $phone,
        private ?string          $address,
        private ?string          $poliId,
        private ?string          $strInstitutionId,
        private ?string          $strRegistrationNumber,
        private ?string          $strActivePeriod,
        private ?string          $sipInstitutionId,
        private ?string          $sipRegistrationNumber,
        private ?string          $sipActivePeriod,
        private ?string          $signature,
        private ?string          $profilePicture,
        array                    $degrees,
        array                    $doctorSchedules,
        array                    $roles,
    ) {
        $this->degrees         = $degrees;
        $this->doctorSchedules = $doctorSchedules;
        $this->roles           = $roles;
    }

    // =========================================================================
    // Factory Methods
    // =========================================================================

    public static function create(
        string   $id,
        ?string  $tenantId,
        string   $name,
        string   $email,
        ?string  $phone,
        ?string  $address,
        ?string  $poliId,
        ?string  $strInstitutionId,
        ?string  $strRegistrationNumber,
        ?string  $strActivePeriod,
        ?string  $sipInstitutionId,
        ?string  $sipRegistrationNumber,
        ?string  $sipActivePeriod,
        ?string  $signature,
        ?string  $profilePicture,
        array    $degrees,
        array    $doctorSchedules,
        array    $roles,
    ): self {
        self::guardName($name);
        self::guardEmail($email);
        self::guardRoles($roles);

        $user = new self(
            id:                    $id,
            tenantId:              $tenantId,
            name:                  $name,
            email:                 $email,
            phone:                 $phone,
            address:               $address,
            poliId:                $poliId,
            strInstitutionId:      $strInstitutionId,
            strRegistrationNumber: $strRegistrationNumber,
            strActivePeriod:       $strActivePeriod,
            sipInstitutionId:      $sipInstitutionId,
            sipRegistrationNumber: $sipRegistrationNumber,
            sipActivePeriod:       $sipActivePeriod,
            signature:             $signature,
            profilePicture:        $profilePicture,
            degrees:               $degrees,
            doctorSchedules:       $doctorSchedules,
            roles:                 $roles,
        );

        $user->recordEvent(new UserCreated(
            userId:   $id,
            tenantId: $tenantId,
            name:     $name,
            email:    $email,
        ));

        return $user;
    }

    public static function reconstitute(
        string   $id,
        ?string  $tenantId,
        string   $name,
        string   $email,
        ?string  $phone,
        ?string  $address,
        ?string  $poliId,
        ?string  $strInstitutionId,
        ?string  $strRegistrationNumber,
        ?string  $strActivePeriod,
        ?string  $sipInstitutionId,
        ?string  $sipRegistrationNumber,
        ?string  $sipActivePeriod,
        ?string  $signature,
        ?string  $profilePicture,
        array    $degrees,
        array    $doctorSchedules,
        array    $roles,
    ): self {
        return new self(
            id:                    $id,
            tenantId:              $tenantId,
            name:                  $name,
            email:                 $email,
            phone:                 $phone,
            address:               $address,
            poliId:                $poliId,
            strInstitutionId:      $strInstitutionId,
            strRegistrationNumber: $strRegistrationNumber,
            strActivePeriod:       $strActivePeriod,
            sipInstitutionId:      $sipInstitutionId,
            sipRegistrationNumber: $sipRegistrationNumber,
            sipActivePeriod:       $sipActivePeriod,
            signature:             $signature,
            profilePicture:        $profilePicture,
            degrees:               $degrees,
            doctorSchedules:       $doctorSchedules,
            roles:                 $roles,
        );
    }

    // =========================================================================
    // Business Methods
    // =========================================================================

    public function update(
        string   $name,
        string   $email,
        ?string  $phone,
        ?string  $address,
        ?string  $poliId,
        ?string  $strInstitutionId,
        ?string  $strRegistrationNumber,
        ?string  $strActivePeriod,
        ?string  $sipInstitutionId,
        ?string  $sipRegistrationNumber,
        ?string  $sipActivePeriod,
        ?string  $signature,
        ?string  $profilePicture,
        array    $degrees,
        array    $doctorSchedules,
        array    $roles,
    ): void {
        self::guardName($name);

        $this->name                  = $name;
        $this->email                 = $email;
        $this->phone                 = $phone;
        $this->address               = $address;
        $this->poliId                = $poliId;
        $this->strInstitutionId      = $strInstitutionId;
        $this->strRegistrationNumber = $strRegistrationNumber;
        $this->strActivePeriod       = $strActivePeriod;
        $this->sipInstitutionId      = $sipInstitutionId;
        $this->sipRegistrationNumber = $sipRegistrationNumber;
        $this->sipActivePeriod       = $sipActivePeriod;
        $this->signature             = $signature;
        $this->profilePicture        = $profilePicture;
        $this->degrees               = $degrees;
        $this->doctorSchedules       = $doctorSchedules;
        $this->roles                 = $roles;

        $this->recordEvent(new UserUpdated(
            userId:   $this->id,
            tenantId: $this->tenantId,
            name:     $name,
        ));
    }

    /**
     * Cek apakah user adalah dokter (punya poli).
     */
    public function isDoctor(): bool
    {
        return $this->poliId !== null;
    }

    /**
     * Cek apakah user punya STR aktif.
     */
    public function hasActiveSTR(): bool
    {
        return $this->strRegistrationNumber !== null && $this->strActivePeriod !== null;
    }

    /**
     * Format nama lengkap dengan gelar.
     * Contoh: "dr. Budi Santoso, Sp.PD"
     */
    public function fullNameWithDegrees(): string
    {
        $prefixes = array_filter($this->degrees, fn(UserDegree $d) => $d->isPrefix());
        $suffixes = array_filter($this->degrees, fn(UserDegree $d) => $d->isSuffix());

        $name = $this->name;

        if (!empty($prefixes)) {
            $name = implode(' ', array_map(fn($d) => $d->degreeName(), $prefixes)) . ' ' . $name;
        }

        if (!empty($suffixes)) {
            $name = $name . ', ' . implode(', ', array_map(fn($d) => $d->degreeName(), $suffixes));
        }

        return trim($name);
    }

    // =========================================================================
    // Guards
    // =========================================================================

    private static function guardName(string $name): void
    {
        if (empty(trim($name))) {
            throw new InvalidArgumentException('Nama user tidak boleh kosong.');
        }
    }

    private static function guardEmail(string $email): void
    {
        if (empty(trim($email))) {
            throw new InvalidArgumentException('Email tidak boleh kosong.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Email '{$email}' tidak valid.");
        }
    }

    private static function guardRoles(array $roles): void
    {
        if (empty($roles)) {
            throw new InvalidArgumentException('User harus memiliki minimal satu role.');
        }
    }

    // =========================================================================
    // Domain Events
    // =========================================================================

    private function recordEvent(object $event): void
    {
        $this->domainEvents[] = $event;
    }

    public function pullDomainEvents(): array
    {
        $events            = $this->domainEvents;
        $this->domainEvents = [];
        return $events;
    }

    // =========================================================================
    // Getters
    // =========================================================================

    public function id(): string                    { return $this->id; }
    public function tenantId(): ?string             { return $this->tenantId; }
    public function name(): string                  { return $this->name; }
    public function email(): string                 { return $this->email; }
    public function phone(): ?string                { return $this->phone; }
    public function address(): ?string              { return $this->address; }
    public function poliId(): ?string               { return $this->poliId; }
    public function strInstitutionId(): ?string     { return $this->strInstitutionId; }
    public function strRegistrationNumber(): ?string { return $this->strRegistrationNumber; }
    public function strActivePeriod(): ?string      { return $this->strActivePeriod; }
    public function sipInstitutionId(): ?string     { return $this->sipInstitutionId; }
    public function sipRegistrationNumber(): ?string { return $this->sipRegistrationNumber; }
    public function sipActivePeriod(): ?string      { return $this->sipActivePeriod; }
    public function signature(): ?string            { return $this->signature; }
    public function profilePicture(): ?string       { return $this->profilePicture; }
    public function degrees(): array                { return $this->degrees; }
    public function doctorSchedules(): array        { return $this->doctorSchedules; }
    public function roles(): array                  { return $this->roles; }
}
