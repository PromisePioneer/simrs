<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\Services;

use Domains\Outpatient\Application\Commands\CreateAppointmentCommand;
use Domains\Outpatient\Application\Commands\UpdateAppointmentCommand;
use Domains\Outpatient\Application\DTO\CreateAppointmentDTO;
use Domains\Outpatient\Application\DTO\UpdateAppointmentDTO;
use Domains\Outpatient\Application\Handlers\CreateAppointmentHandler;
use Domains\Outpatient\Application\Handlers\UpdateAppointmentHandler;
use Domains\Outpatient\Domain\Repository\AppointmentRepositoryInterface;
use Domains\Outpatient\Infrastructure\Persistence\Models\AppointmentModel;
use Illuminate\Http\Request;

final readonly class AppointmentService
{
    public function __construct(
        private AppointmentRepositoryInterface $repository,
        private CreateAppointmentHandler       $createHandler,
        private UpdateAppointmentHandler       $updateHandler,
    )
    {
    }

    public function getAll(Request $request): object
    {
        $filters = $request->only([
            'search', 'status', 'advanced_status',
            'patient_id', 'date_from', 'date_to',
        ]);
        $perPage = $request->input('per_page') ? (int)$request->input('per_page') : null;

        return $this->repository->findAll($filters, $perPage);
    }

    public function findById(string $id): object
    {
        return AppointmentModel::with('patient')->find($id);
    }

    public function findByVisitNumber(string $visitNumber): ?object
    {
        return $this->repository->findByVisitNumber($visitNumber);
    }

    public function create(array $data): object
    {
        $dto = CreateAppointmentDTO::fromArray($data);
        $command = new CreateAppointmentCommand($dto);

        return $this->createHandler->handle($command);
    }

    public function update(string $id, array $data): object
    {
        $dto = UpdateAppointmentDTO::fromArray($data);
        $command = new UpdateAppointmentCommand($id, $dto);

        return $this->updateHandler->handle($command);
    }

    public function delete(string $id): void
    {
        $this->repository->delete($id);
    }

    public function bulkDelete(array $ids): void
    {
        AppointmentModel::whereIn('id', $ids)->delete();
    }
}
