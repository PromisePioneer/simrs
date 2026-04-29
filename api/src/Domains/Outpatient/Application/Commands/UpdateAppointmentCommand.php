<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\Commands;

use Domains\Outpatient\Application\DTO\UpdateAppointmentDTO;

final class UpdateAppointmentCommand
{
    public function __construct(
        public readonly string            $id,
        public readonly UpdateAppointmentDTO $dto,
    ) {}
}
