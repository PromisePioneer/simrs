<?php

declare(strict_types=1);

namespace Domains\Outpatient\Application\Services;

use Domains\Outpatient\Domain\Repository\AppointmentRepositoryInterface;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

final class AppointmentService extends BaseCrudService
{
    public function __construct(AppointmentRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    protected function extractFilters(Request $request): array
    {
        return $request->only(['search', 'doctor_id', 'patient_id']);
    }
}
