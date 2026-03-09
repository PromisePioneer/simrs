<?php

namespace App\Services\Master\General\Doctor\Service;

use App\Models\DoctorSchedule;
use App\Services\Master\General\Doctor\Repository\DoctorScheduleRepository;
use Illuminate\Http\Request;

class DoctorScheduleService
{
    private DoctorScheduleRepository $doctorScheduleRepository;

    public function __construct()
    {
        $this->doctorScheduleRepository = new DoctorScheduleRepository();
    }


    public function getDoctorSchedules(Request $request): ?object
    {
        $filters = $request->only('search', 'user_id');
        $perPage = $request->input('per_page');

        return $this->doctorScheduleRepository->getDoctorSchedules($filters, $perPage);
    }


    public function store(Request $request): array
    {
        $schedules = $request->input('schedules');
        $data = [];
        foreach ($schedules as $schedule) {
            foreach ($schedule['times'] as $time) {
                $data[] = DoctorSchedule::create([
                    'user_id' => $request->input('user_id'),
                    'day_of_week' => $schedule['day'],
                    'start_time' => $time['start_time'],
                    'end_time' => $time['end_time'],
                ]);
            }
        }

        return $data;
    }
}
