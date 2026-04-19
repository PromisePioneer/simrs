<?php

declare(strict_types=1);

namespace Domains\Patient\Application\Handlers;

use DateTimeImmutable;
use Domains\Patient\Application\Commands\UpdatePatientCommand;
use Domains\Patient\Domain\Entities\Patient;
use Domains\Patient\Domain\Exceptions\PatientNotFoundException;
use Domains\Patient\Domain\Repository\PatientRepositoryInterface;
use Domains\Patient\Domain\ValueObjects\Gender;
use Domains\Patient\Domain\ValueObjects\PatientAddress;
use Domains\Patient\Domain\ValueObjects\PatientPaymentMethod;
use Illuminate\Contracts\Events\Dispatcher;
use Throwable;

/**
 * Handler: Mengorkestrasi use case "Perbarui Data Pasien".
 *
 * Alur:
 * 1. Load aggregate dari repository (reconstitute dari DB)
 * 2. Panggil method bisnis di entity (patient->update())
 * 3. Simpan kembali ke repository
 * 4. Dispatch domain events
 */
final class UpdatePatientHandler
{
    public function __construct(
        private readonly PatientRepositoryInterface $repository,
        private readonly Dispatcher                 $dispatcher,
    ) {}

    /**
     * @throws PatientNotFoundException
     * @throws Throwable
     */
    public function handle(UpdatePatientCommand $command): Patient
    {
        $dto = $command->dto;

        // Load aggregate — repository melakukan reconstitute dari Eloquent ke Entity
        $patient = $this->repository->findById($dto->patientId);

        // Bangun Value Objects dari raw data DTO
        $addresses = array_map(
            fn(array $addr) => PatientAddress::fromArray($addr),
            $dto->addresses
        );

        $paymentMethods = array_map(
            fn(array $pm) => PatientPaymentMethod::fromArray($pm),
            $dto->paymentMethods
        );

        // Delegasikan perubahan ke entity — business rule dijalankan di sini
        $patient->update(
            fullName:           $dto->fullName,
            cityOfBirth:        $dto->cityOfBirth,
            dateOfBirth:        new DateTimeImmutable($dto->dateOfBirth),
            idCardNumber:       $dto->idCardNumber,
            gender:             Gender::fromString($dto->gender),
            religion:           $dto->religion,
            bloodType:          $dto->bloodType,
            job:                $dto->job,
            phone:              $dto->phone,
            email:              $dto->email,
            dateOfConsultation: new DateTimeImmutable($dto->dateOfConsultation ?? 'today'),
            kisNumber:          $dto->kisNumber,
            profilePicture:     $dto->profilePicturePath,
            addresses:          $addresses,
            paymentMethods:     $paymentMethods,
        );

        // Persist perubahan
        $this->repository->update($patient);

        // Dispatch domain events
        foreach ($patient->pullDomainEvents() as $event) {
            $this->dispatcher->dispatch($event);
        }

        return $patient;
    }
}
