<?php

namespace App\Http\Controllers\Api\General\Doctor;

use App\Services\Master\General\Doctor\Service\DoctorScheduleService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorScheduleController
{
    use ApiResponse;


    private DoctorScheduleService $doctorScheduleService;

    public function __construct()
    {
        $this->doctorScheduleService = new DoctorScheduleService();
    }

    public function index(Request $request): JsonResponse
    {
        $user = $this->doctorScheduleService->getDoctorSchedules($request);
        return response()->json($user);
    }


    public function store(Request $request): JsonResponse
    {
        $user = $this->doctorScheduleService->store($request);
        return $this->successResponse($user, 'Doctor schedule created successfully.');
    }

}
