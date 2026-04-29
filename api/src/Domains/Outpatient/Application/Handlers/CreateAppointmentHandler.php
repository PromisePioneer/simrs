<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\Handlers;

use Domains\Outpatient\Application\Commands\CreateAppointmentCommand;
use Domains\Outpatient\Domain\Repository\AppointmentRepositoryInterface;
use Domains\Outpatient\Domain\ValueObjects\VisitNumber;

final class CreateAppointmentHandler
{
    public function __construct(
        private readonly AppointmentRepositoryInterface $repository,
    ) {}

    public function handle(CreateAppointmentCommand $command): object
    {
        // Validate visit number format via Value Object
        new VisitNumber($command->dto->visitNumber);

        return $this->repository->store($command->dto->toArray());
    }
}
