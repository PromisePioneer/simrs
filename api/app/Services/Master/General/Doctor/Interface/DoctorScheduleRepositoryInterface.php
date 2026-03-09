<?php

namespace App\Services\Master\General\Doctor\Interface;

interface DoctorScheduleRepositoryInterface
{
    public function getDoctorSchedules(array $filters = [], ?int $perPage = null): ?object;
}
