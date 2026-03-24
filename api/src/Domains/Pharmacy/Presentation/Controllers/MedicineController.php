<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Pharmacy\Application\Services\MedicineService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Domains\Pharmacy\Presentation\Requests\MedicineRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class MedicineController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly MedicineService $medicineService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', MedicineModel::class);
        $data = $this->medicineService->getMedicines(request: $request);
        return response()->json($data);
    }

    /** @throws Throwable */
    public function store(MedicineRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineModel::class);
        $data = $this->medicineService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Product created successfully.');
    }

    public function show(MedicineModel $medicine): JsonResponse
    {
        $this->authorize('view', $medicine);
        $medicine->load(['category', 'batches', 'units']);
        return response()->json($medicine);
    }

    /** @throws Throwable */
    public function update(MedicineRequest $request, MedicineModel $medicine): JsonResponse
    {
        $this->authorize('update', $medicine);
        $data = $this->medicineService->update(data: $request->validated(), medicine: $medicine);
        return $this->successResponse(data: $data, message: 'Product updated successfully.');
    }

    public function destroy(MedicineModel $medicine): JsonResponse
    {
        $this->authorize('delete', $medicine);
        $this->medicineService->destroy(medicine: $medicine);
        return $this->successResponse(data: $medicine, message: 'Product deleted successfully.');
    }

    public function getReadyStocksMedicine(): JsonResponse
    {
        $data = $this->medicineService->getReadyStockMedicine();
        return response()->json($data);
    }
}
