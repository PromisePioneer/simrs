<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\Handlers;

use Domains\Outpatient\Application\Commands\UpdateAppointmentCommand;
use Domains\Outpatient\Domain\Repository\AppointmentRepositoryInterface;

final class UpdateAppointmentHandler
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $repository,
    ) {}

    public function handle(UpdateAppointmentCommand $command): object
    {
        return $this->repository->update($command->id, $command->dto->toArray());
    }
}
