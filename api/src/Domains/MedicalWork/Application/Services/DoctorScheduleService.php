<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Application\Services;

use Domains\MedicalWork\Domain\Repository\DoctorScheduleRepositoryInterface;
use Domains\MedicalWork\Infrastructure\Persistence\Repositories\EloquentDoctorScheduleRepository;
use Domains\Shared\Application\Services\BaseCrudService;
use Illuminate\Http\Request;

class DoctorScheduleService extends BaseCrudService
{
    public function __construct(
        private readonly EloquentDoctorScheduleRepository $scheduleRepo
    ) {
        parent::__construct($scheduleRepo);
    }

    protected function extractFilters(Request $request): array
    {
        return $request->only(['search', 'user_id']);
    }

    public function syncForUser(string $userId, array $schedules): array
    {
        return $this->scheduleRepo->syncForUser($userId, $schedules);
    }
}
