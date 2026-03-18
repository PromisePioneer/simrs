<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Infrastructure\Persistence\Repositories;

use App\Models\DoctorSchedule;
use Domains\MedicalWork\Domain\Repository\DoctorScheduleRepositoryInterface;
use Domains\MedicalWork\Infrastructure\Persistence\Models\DoctorScheduleModel;
use Domains\Shared\Infrastructure\Persistence\Repositories\BaseEloquentRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EloquentDoctorScheduleRepository extends BaseEloquentRepository implements DoctorScheduleRepositoryInterface
{
    public function __construct() { parent::__construct(new DoctorScheduleModel()); }

    protected function applyFilters($query, array $filters)
    {
        if (!empty($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }
        return $query;
    }

    public function findAll(array $filters = [], ?int $perPage = null): object
    {
        $query = $this->model->newQuery()->with('doctor')->orderBy('day_of_week');
        $query = $this->applyFilters($query, $filters);
        return $perPage ? $query->paginate($perPage) : (object) $query->get();
    }

    /**
     * Bulk store schedules untuk satu user.
     * Format input: [['day_of_week' => 'monday', 'times' => [['start_time' => '08:00', 'end_time' => '12:00']]]]
     */
    public function syncForUser(string $userId, array $schedules): array
    {
        return DB::transaction(function () use ($userId, $schedules) {
            DoctorSchedule::where('user_id', $userId)->delete();

            $result = [];
            foreach ($schedules as $schedule) {
                foreach ($schedule['times'] as $time) {
                    $result[] = DoctorSchedule::create([
                        'user_id'     => $userId,
                        'day_of_week' => $schedule['day'],
                        'start_time'  => $time['start_time'],
                        'end_time'    => $time['end_time'],
                    ]);
                }
            }
            return $result;
        });
    }
}
