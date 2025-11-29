<?php

namespace App\Services\Master\General\Doctor\Repository;

use App\Http\Requests\DoctorScheduleRequest;
use App\Models\DoctorSchedule;
use App\Services\Master\General\Doctor\Interface\DoctorScheduleRepositoryInterface;

class DoctorScheduleRepository implements DoctorScheduleRepositoryInterface
{
    private DoctorSchedule $model;

    public function __construct()
    {
        $this->model = new DoctorSchedule();
    }

    public function getDoctorSchedules(array $filters = [], ?int $perPage = null, ?int $userId = null): ?object
    {
        $query = $this->model->with('user')->orderBy("created_at");


        if (!empty($filters['user_id'])) {
            $query->where("user_id", $filters['user_id']);
        }

        if (!empty($filters['search'])) {
            $query->whereHas('user', function ($query) use ($filters) {
                $query->where('name', 'like', '%' . $filters['search'] . '%');
            })->orWhere('day_of_week', 'like', '%' . $filters['search'] . '%');
        }


        if ($perPage) {
            return $query->paginate($perPage);
        }

        return $query->get();
    }


    public function store(DoctorScheduleRequest $request): ?object
    {

    }
}
