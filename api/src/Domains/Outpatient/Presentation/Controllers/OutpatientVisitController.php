<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Outpatient\Application\Services\OutpatientVisitService;
use Domains\Outpatient\Infrastructure\Persistence\Models\OutpatientVisitModel;
use Domains\Outpatient\Presentation\Requests\OutpatientVisitRequest;
use Domains\Outpatient\Presentation\Resources\OutpatientVisitResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutpatientVisitController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly OutpatientVisitService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', OutpatientVisitModel::class);
        return response()->json(OutpatientVisitResource::collection($this->service->getAll($request)));
    }

    public function store(OutpatientVisitRequest $request): JsonResponse
    {
        $this->authorize('create', OutpatientVisitModel::class);
        $result = $this->service->store($request->validated());
        return $this->successResponse(new OutpatientVisitResource($result), 'Kunjungan rawat jalan berhasil dibuat.');
    }

    public function show(string $id): JsonResponse
    {
        $this->authorize('view', OutpatientVisitModel::class);
        return response()->json(new OutpatientVisitResource($this->service->findById($id)));
    }

    public function update(OutpatientVisitRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', OutpatientVisitModel::class);
        $result = $this->service->update($request->validated(), $id);
        return $this->successResponse(new OutpatientVisitResource($result), 'Kunjungan rawat jalan berhasil diperbarui.');
    }

    public function destroy(string $id): JsonResponse
    {
        $this->authorize('delete', OutpatientVisitModel::class);
        $this->service->destroy($id);
        return $this->successResponse(null, 'Kunjungan rawat jalan berhasil dihapus.');
    }
}
