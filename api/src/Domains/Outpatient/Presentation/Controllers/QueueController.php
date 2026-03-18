<?php

declare(strict_types=1);

namespace Domains\Outpatient\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Outpatient\Application\Services\QueueService;
use Domains\Outpatient\Presentation\Resources\QueueResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QueueController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly QueueService $service) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json(QueueResource::collection($this->service->getAll($request)));
    }

    public function store(Request $request): JsonResponse
    {
        $result = $this->service->store($request->all());
        return response()->json(new QueueResource($result));
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(new QueueResource($this->service->findById($id)));
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $result = $this->service->update($request->all(), $id);
        return response()->json(new QueueResource($result));
    }

    public function destroy(string $id): JsonResponse
    {
        $this->service->delete($id);
        return $this->successResponse(null, 'Antrian berhasil dihapus.');
    }

    public function startDiagnose(string $id): JsonResponse
    {
        $this->service->startDiagnose($id);
        return $this->successResponse(null, 'Diagnose started successfully.');
    }

    public function countTodayQueues(): JsonResponse
    {
        return response()->json($this->service->countTodayQueues());
    }
}
