<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Outpatient\Application\Services\AppointmentService;
use Domains\Outpatient\Infrastructure\Persistence\Models\AppointmentModel;
use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Domains\Outpatient\Presentation\Requests\AppointmentRequest;
use Domains\Outpatient\Presentation\Resources\AppointmentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly AppointmentService $service,
    )
    {
    }

    public function index(Request $request): JsonResource
    {
        $this->authorize('viewAny', AppointmentModel::class);
        return AppointmentResource::collection($this->service->getAll($request));
    }

    public function store(AppointmentRequest $request): JsonResponse
    {
        $this->authorize('create', AppointmentModel::class);
        $data = array_merge($request->validated(), ['tenant_id' => $request->user()->tenant_id]);
        $result = $this->service->create($data);

        return $this->successResponse(
            new AppointmentResource($result),
            'Appointment berhasil dibuat.',
            201,
        );
    }

    public function show(string $id): JsonResponse
    {
        $this->authorize('view', AppointmentModel::class);
        $result = $this->service->findById($id);

        return response()->json(new AppointmentResource($result));
    }

    public function update(AppointmentRequest $request, string $id): JsonResponse
    {

        $this->authorize('update', AppointmentModel::class);
        $result = $this->service->update($id, $request->validated());

        return $this->successResponse(
            new AppointmentResource($result),
            'Appointment berhasil diperbarui.',
        );
    }

    public function destroy(Request $request): JsonResponse
    {
        $this->authorize('delete', AppointmentModel::class);
        $this->service->bulkDelete($request->ids);

        return $this->successResponse(null, 'Appointment berhasil dihapus.');
    }
}
