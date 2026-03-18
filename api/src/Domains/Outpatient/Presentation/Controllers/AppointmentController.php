<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Outpatient\Application\Services\AppointmentService;
use Domains\Outpatient\Application\Services\OutpatientVisitService;
use Domains\Outpatient\Presentation\Requests\AppointmentRequest;
use Domains\Outpatient\Presentation\Resources\AppointmentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly AppointmentService $service) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json(AppointmentResource::collection($this->service->getAll($request)));
    }

    public function store(AppointmentRequest $request): JsonResponse
    {
        $result = $this->service->store($request->validated());
        return $this->successResponse(new AppointmentResource($result), 'Appointment berhasil dibuat.');
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(new AppointmentResource($this->service->findById($id)));
    }

    public function update(AppointmentRequest $request, string $id): JsonResponse
    {
        $result = $this->service->update($request->validated(), $id);
        return $this->successResponse(new AppointmentResource($result), 'Appointment berhasil diperbarui.');
    }

    public function destroy(string $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(null, 'Appointment berhasil dihapus.');
    }
}
