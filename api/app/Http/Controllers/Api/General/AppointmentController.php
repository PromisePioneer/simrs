<?php

namespace App\Http\Controllers\Api\General;

use App\Http\Controllers\Controller;
use App\Http\Requests\AppointmentRequest;
use App\Models\Appointment;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $appointments = Appointment::paginate();
        return response()->json($appointments);
    }

    public function store(AppointmentRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['doctor_id'] = $request->doctor_id;
        $appointment = Appointment::create($data);
        return $this->successResponse($appointment, 'Appointment created successfully.');
    }

    public function show(Appointment $appointment): JsonResponse
    {
        return response()->json($appointment);
    }


    public function update(AppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $data = $request->validated();
        $data['doctor_id'] = $request->doctor_id;
        $appointment->update($data);
        return $this->successResponse($appointment, 'Appointment updated successfully.');
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $appointment->delete();
        return $this->successResponse($appointment, 'Appointment deleted successfully.');
    }
}
