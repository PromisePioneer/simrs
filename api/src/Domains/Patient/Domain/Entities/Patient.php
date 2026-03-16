<?php

declare(strict_types=1);

namespace Domains\Patient\Domain\Entities;

use DateTimeImmutable;
use Domains\Patient\Domain\Events\PatientRegistered;
use Domains\Patient\Domain\Events\PatientUpdated;
use Domains\Patient\Domain\ValueObjects\Gender;
use Domains\Patient\Domain\ValueObjects\MedicalRecordNumber;
use Domains\Patient\Domain\ValueObjects\PatientAddress;
use Domains\Patient\Domain\ValueObjects\PatientPaymentMethod;
use InvalidArgumentException;

/**
 * Aggregate Root: Patient
 *
 * Ini adalah inti domain pasien. TIDAK boleh extend Eloquent.
 * Semua business rule tentang pasien hidup di sini.
 *
 * Domain Events di-collect di sini, lalu di-dispatch oleh Handler
 * setelah persistence berhasil.
 */
final class Patient
{
    /** @var PatientAddress[] */
    private array $addresses;

    /** @var PatientPaymentMethod[] */
    private array $paymentMethods;

    /** @var object[] Domain events yang menunggu untuk di-dispatch */
    private array $domainEvents = [];

    private function __construct(
        private readonly string     $id,
        private readonly ?string    $tenantId,
        private MedicalRecordNumber $medicalRecordNumber,
        private string              $fullName,
        private string              $cityOfBirth,
        private DateTimeImmutable   $dateOfBirth,
        private string              $idCardNumber,
        private Gender              $gender,
        private ?string             $religion,
        private ?string             $bloodType,
        private string              $job,
        private string              $phone,
        private ?string             $email,
        private DateTimeImmutable   $dateOfConsultation,
        private ?string             $kisNumber,
        private ?string             $profilePicture,
        array                       $addresses,
        array                       $paymentMethods,
    )
    {
        $this->addresses = $addresses;
        $this->paymentMethods = $paymentMethods;
    }

    // =========================================================================
    // Factory Methods
    // =========================================================================

    /**
     * Buat pasien baru (use case: registrasi).
     * Meng-emit PatientRegistered event.
     */
    public static function register(
        string              $id,
        ?string             $tenantId,
        MedicalRecordNumber $medicalRecordNumber,
        string              $fullName,
        string              $cityOfBirth,
        DateTimeImmutable   $dateOfBirth,
        string              $idCardNumber,
        Gender              $gender,
        ?string             $religion,
        ?string             $bloodType,
        string              $job,
        string              $phone,
        ?string             $email,
        DateTimeImmutable   $dateOfConsultation,
        ?string             $kisNumber,
        ?string             $profilePicture,
        array               $addresses,
        array               $paymentMethods,
    ): self
    {
        self::guardFullName($fullName);
        self::guardPhone($phone);

        $patient = new self(
            id: $id,
            tenantId: $tenantId,
            medicalRecordNumber: $medicalRecordNumber,
            fullName: $fullName,
            cityOfBirth: $cityOfBirth,
            dateOfBirth: $dateOfBirth,
            idCardNumber: $idCardNumber,
            gender: $gender,
            religion: $religion,
            bloodType: $bloodType,
            job: $job,
            phone: $phone,
            email: $email,
            dateOfConsultation: $dateOfConsultation,
            kisNumber: $kisNumber,
            profilePicture: $profilePicture,
            addresses: $addresses,
            paymentMethods: $paymentMethods,
        );

        // Emit domain event
        $patient->recordEvent(new PatientRegistered(
            patientId: $id,
            tenantId: $tenantId,
            medicalRecordNumber: $medicalRecordNumber->value(),
            fullName: $fullName,
            occurredAt: new DateTimeImmutable(),
        ));

        return $patient;
    }

    /**
     * Reconstitute dari persistence (tidak emit event).
     */
    public static function reconstitute(
        string              $id,
        ?string              $tenantId,
        MedicalRecordNumber $medicalRecordNumber,
        string              $fullName,
        string              $cityOfBirth,
        DateTimeImmutable   $dateOfBirth,
        string              $idCardNumber,
        Gender              $gender,
        ?string             $religion,
        ?string             $bloodType,
        string              $job,
        string              $phone,
        ?string             $email,
        DateTimeImmutable   $dateOfConsultation,
        ?string             $kisNumber,
        ?string             $profilePicture,
        array               $addresses,
        array               $paymentMethods,
    ): self
    {
        return new self(
            id: $id,
            tenantId: $tenantId,
            medicalRecordNumber: $medicalRecordNumber,
            fullName: $fullName,
            cityOfBirth: $cityOfBirth,
            dateOfBirth: $dateOfBirth,
            idCardNumber: $idCardNumber,
            gender: $gender,
            religion: $religion,
            bloodType: $bloodType,
            job: $job,
            phone: $phone,
            email: $email,
            dateOfConsultation: $dateOfConsultation,
            kisNumber: $kisNumber,
            profilePicture: $profilePicture,
            addresses: $addresses,
            paymentMethods: $paymentMethods,
        );
    }

    // =========================================================================
    // Business Methods (behaviour)
    // =========================================================================

    /**
     * Update data pasien.
     * Business rule: MRN tidak bisa diubah setelah registrasi.
     */
    public function update(
        string            $fullName,
        string            $cityOfBirth,
        DateTimeImmutable $dateOfBirth,
        string            $idCardNumber,
        Gender            $gender,
        ?string           $religion,
        ?string           $bloodType,
        string            $job,
        string            $phone,
        ?string           $email,
        DateTimeImmutable $dateOfConsultation,
        ?string           $kisNumber,
        ?string           $profilePicture,
        array             $addresses,
        array             $paymentMethods,
    ): void
    {
        self::guardFullName($fullName);
        self::guardPhone($phone);

        $this->fullName = $fullName;
        $this->cityOfBirth = $cityOfBirth;
        $this->dateOfBirth = $dateOfBirth;
        $this->idCardNumber = $idCardNumber;
        $this->gender = $gender;
        $this->religion = $religion;
        $this->bloodType = $bloodType;
        $this->job = $job;
        $this->phone = $phone;
        $this->email = $email;
        $this->dateOfConsultation = $dateOfConsultation;
        $this->kisNumber = $kisNumber;
        $this->profilePicture = $profilePicture;
        $this->addresses = $addresses;
        $this->paymentMethods = $paymentMethods;

        $this->recordEvent(new PatientUpdated(
            patientId: $this->id,
            tenantId: $this->tenantId,
            fullName: $fullName,
            occurredAt: new DateTimeImmutable(),
        ));
    }

    /**
     * Cek apakah pasien menggunakan BPJS.
     */
    public function hasBpjs(): bool
    {
        foreach ($this->paymentMethods as $method) {
            if ($method->isBpjs()) {
                return true;
            }
        }
        return false;
    }

    // =========================================================================
    // Guards (business invariants)
    // =========================================================================

    private static function guardFullName(string $fullName): void
    {
        if (empty(trim($fullName))) {
            throw new InvalidArgumentException('Nama lengkap tidak boleh kosong.');
        }
        if (strlen($fullName) < 2) {
            throw new InvalidArgumentException('Nama lengkap minimal 2 karakter.');
        }
    }

    private static function guardPhone(string $phone): void
    {
        if (empty(trim($phone))) {
            throw new InvalidArgumentException('Nomor telepon tidak boleh kosong.');
        }
    }

    // =========================================================================
    // Domain Event Management
    // =========================================================================

    private function recordEvent(object $event): void
    {
        $this->domainEvents[] = $event;
    }

    /** @return object[] */
    public function pullDomainEvents(): array
    {
        $events = $this->domainEvents;
        $this->domainEvents = [];
        return $events;
    }

    // =========================================================================
    // Getters (read-only access)
    // =========================================================================

    public function id(): string
    {
        return $this->id;
    }

    public function tenantId(): ?string
    {
        return $this->tenantId;
    }

    public function medicalRecordNumber(): MedicalRecordNumber
    {
        return $this->medicalRecordNumber;
    }

    public function fullName(): string
    {
        return $this->fullName;
    }

    public function cityOfBirth(): string
    {
        return $this->cityOfBirth;
    }

    public function dateOfBirth(): DateTimeImmutable
    {
        return $this->dateOfBirth;
    }

    public function idCardNumber(): string
    {
        return $this->idCardNumber;
    }

    public function gender(): Gender
    {
        return $this->gender;
    }

    public function religion(): ?string
    {
        return $this->religion;
    }

    public function bloodType(): ?string
    {
        return $this->bloodType;
    }

    public function job(): string
    {
        return $this->job;
    }

    public function phone(): string
    {
        return $this->phone;
    }

    public function email(): ?string
    {
        return $this->email;
    }

    public function dateOfConsultation(): DateTimeImmutable
    {
        return $this->dateOfConsultation;
    }

    public function kisNumber(): ?string
    {
        return $this->kisNumber;
    }

    public function profilePicture(): ?string
    {
        return $this->profilePicture;
    }

    /** @return PatientAddress[] */
    public function addresses(): array
    {
        return $this->addresses;
    }

    /** @return PatientPaymentMethod[] */
    public function paymentMethods(): array
    {
        return $this->paymentMethods;
    }
}
