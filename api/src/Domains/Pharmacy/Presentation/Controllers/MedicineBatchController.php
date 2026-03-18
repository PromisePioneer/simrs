<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Pharmacy\Application\Services\MedicineBatchService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Domains\Pharmacy\Presentation\Requests\MedicineBatchRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class MedicineBatchController extends Controller
{
    use ApiResponse;

    public function __construct(private MedicineBatchService $batchService) {}

    public function index(Request $request, MedicineModel $medicine): JsonResponse
    {
        $data = $this->batchService->getBatches(request: $request, medicine: $medicine);
        return response()->json($data);
    }

    public function show(MedicineBatchModel $medicineBatch): JsonResponse
    {
        $medicineBatch->load(['stock.warehouse', 'stock.rack', 'medicine']);
        return response()->json($medicineBatch);
    }

    /** @throws Throwable */
    public function store(MedicineBatchRequest $request): JsonResponse
    {
        $data = $this->batchService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Batch berhasil disimpan.');
    }

    public function update(MedicineBatchRequest $request, MedicineBatchModel $medicineBatch): JsonResponse
    {
        $data = $this->batchService->update(data: $request->validated(), batch: $medicineBatch);
        return $this->successResponse(data: $data, message: 'Batch berhasil diperbarui.');
    }

    public function destroy(MedicineBatchModel $medicineBatch): JsonResponse
    {
        $medicineBatch->delete();
        return $this->successResponse(data: $medicineBatch, message: 'Batch berhasil dihapus.');
    }
}
