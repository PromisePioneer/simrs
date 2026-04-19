<?php

declare(strict_types=1);

namespace Domains\Patient\Application\Handlers;

use DateTimeImmutable;
use Domains\Patient\Application\Commands\RegisterPatientCommand;
use Domains\Patient\Domain\Entities\Patient;
use Domains\Patient\Domain\Exceptions\PatientAlreadyExistsException;
use Domains\Patient\Domain\Repository\PatientRepositoryInterface;
use Domains\Patient\Domain\ValueObjects\Gender;
use Domains\Patient\Domain\ValueObjects\MedicalRecordNumber;
use Domains\Patient\Domain\ValueObjects\PatientAddress;
use Domains\Patient\Domain\ValueObjects\PatientPaymentMethod;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Str;
use Throwable;

/**
 * Handler: Mengorkestrasi use case "Daftarkan Pasien Baru".
 *
 * Tanggung jawab handler:
 * 1. Validasi business rule (cek duplikat NIK/email)
 * 2. Generate UUID dan MRN
 * 3. Bangun Aggregate Root (Patient entity)
 * 4. Perintahkan repository untuk menyimpan
 * 5. Dispatch domain events
 *
 * Handler TIDAK boleh berisi logic bisnis — itu milik Entity.
 * Handler TIDAK tahu tentang HTTP — itu milik Controller.
 */
final class RegisterPatientHandler
{
    public function __construct(
        private readonly PatientRepositoryInterface $repository,
        private readonly Dispatcher                 $dispatcher,
    ) {}

    /**
     * @throws PatientAlreadyExistsException
     * @throws Throwable
     */
    public function handle(RegisterPatientCommand $command): Patient
    {
        $dto = $command->dto;

        // Business rule: cek duplikat NIK dalam satu tenant
        $existingByNik = $this->repository->findByIdCardNumber($dto->idCardNumber, $dto->tenantId);
        if ($existingByNik !== null) {
            throw PatientAlreadyExistsException::withNIK($dto->idCardNumber);
        }

        // Business rule: cek duplikat email dalam satu tenant
        if ($dto->email !== null) {
            $existingByEmail = $this->repository->findByEmail($dto->email, $dto->tenantId);
            if ($existingByEmail !== null) {
                throw PatientAlreadyExistsException::withEmail($dto->email);
            }
        }

        // Generate MRN berdasarkan sequence terakhir dalam tenant
        $lastSequence = $this->repository->getLastMedicalRecordSequence($dto->tenantId);
        $mrn = MedicalRecordNumber::generate(
            tenantCode:   $this->extractTenantCode($dto->tenantId),
            lastSequence: $lastSequence,
        );

        // Bangun Value Objects
        $addresses = array_map(
            fn(array $addr) => PatientAddress::fromArray($addr),
            $dto->addresses
        );

        $paymentMethods = array_map(
            fn(array $pm) => PatientPaymentMethod::fromArray($pm),
            $dto->paymentMethods
        );

        // Buat Aggregate Root — di sinilah Patient::register() dipanggil
        // dan PatientRegistered event direkam di dalam entity
        $patient = Patient::register(
            id:                  Str::uuid()->toString(),
            tenantId:            $dto->tenantId,
            medicalRecordNumber: $mrn,
            fullName:            $dto->fullName,
            cityOfBirth:         $dto->cityOfBirth,
            dateOfBirth:         new DateTimeImmutable($dto->dateOfBirth),
            idCardNumber:        $dto->idCardNumber,
            gender:              Gender::fromString($dto->gender),
            religion:            $dto->religion,
            bloodType:           $dto->bloodType,
            job:                 $dto->job,
            phone:               $dto->phone,
            email:               $dto->email,
            dateOfConsultation:  new DateTimeImmutable($dto->dateOfConsultation ?? 'today'),
            kisNumber:           $dto->kisNumber,
            profilePicture:      $dto->profilePicturePath,
            addresses:           $addresses,
            paymentMethods:      $paymentMethods,
        );

        // Simpan ke persistence
        $this->repository->save($patient);

        // Dispatch semua domain events yang direkam oleh entity
        foreach ($patient->pullDomainEvents() as $event) {
            $this->dispatcher->dispatch($event);
        }

        return $patient;
    }

    /**
     * Extract tenant code dari tenant_id untuk prefix MRN.
     * Di produksi, ini idealnya query ke TenantRepository.
     * Untuk simplisitas, kita pakai 3 karakter pertama dari UUID.
     */
    private function extractTenantCode(?string $tenantId): string
    {
        return 'EMR';
    }
}
