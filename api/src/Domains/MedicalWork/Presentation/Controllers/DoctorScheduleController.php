<?php

declare(strict_types=1);

namespace Domains\MedicalWork\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\MedicalWork\Application\Services\DoctorScheduleService;
use Domains\MedicalWork\Presentation\Resources\DoctorScheduleResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorScheduleController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly DoctorScheduleService $service) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json(DoctorScheduleResource::collection($this->service->getAll($request)));
    }

    public function store(Request $request): JsonResponse
    {
        $userId    = $request->input('user_id');
        $schedules = $request->input('schedules', []);
        $result    = $this->service->syncForUser($userId, $schedules);
        return $this->successResponse($result, 'Jadwal dokter berhasil disimpan.');
    }
}
