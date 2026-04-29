<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\Commands;

use Domains\Outpatient\Application\DTO\CreateAppointmentDTO;

final class CreateAppointmentCommand
{
    public function __construct(
        public readonly CreateAppointmentDTO $dto,
    ) {}
}
