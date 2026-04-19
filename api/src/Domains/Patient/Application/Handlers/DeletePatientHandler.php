<?php

declare(strict_types=1);

namespace Domains\Patient\Application\Handlers;

use Domains\Patient\Application\Commands\DeletePatientCommand;
use Domains\Patient\Domain\Exceptions\PatientNotFoundException;
use Domains\Patient\Domain\Repository\PatientRepositoryInterface;

/**
 * Handler: Mengorkestrasi use case "Hapus Pasien".
 *
 * Business rule: Pasien yang sudah punya outpatient visit
 * idealnya tidak boleh dihapus (soft delete saja).
 * Untuk sekarang, hard delete — bisa diperluas sesuai kebutuhan.
 */
final class DeletePatientHandler
{
    public function __construct(
        private readonly PatientRepositoryInterface $repository,
    ) {}

    /**
     * @throws PatientNotFoundException
     */
    public function handle(DeletePatientCommand $command): void
    {
        $patient = $this->repository->findById($command->patientId);
        $this->repository->delete($patient);
    }
}
