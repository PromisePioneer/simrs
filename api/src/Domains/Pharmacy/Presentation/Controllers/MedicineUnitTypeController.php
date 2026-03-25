<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Pharmacy\Application\Services\MedicineUnitTypeService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineUnitTypeModel;
use Domains\Pharmacy\Presentation\Requests\MedicineUnitTypeRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class MedicineUnitTypeController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly MedicineUnitTypeService $unitTypeService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', MedicineUnitTypeModel::class);
        $data = $this->unitTypeService->getAll(request: $request);
        return response()->json($data);
    }

    /** @throws Throwable */
    public function store(MedicineUnitTypeRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineUnitTypeModel::class);
        $data = $this->unitTypeService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Satuan obat berhasil ditambahkan.', statusCode: 201);
    }

    public function show(MedicineUnitTypeModel $medicineUnitType): JsonResponse
    {
        $this->authorize('view', $medicineUnitType);
        return response()->json($medicineUnitType);
    }

    /** @throws Throwable */
    public function update(MedicineUnitTypeRequest $request, MedicineUnitTypeModel $medicineUnitType): JsonResponse
    {
        $this->authorize('update', $medicineUnitType);
        $data = $this->unitTypeService->update(data: $request->validated(), id: $medicineUnitType->id);
        return $this->successResponse(data: $data, message: 'Satuan obat berhasil diperbarui.');
    }

    public function destroy(MedicineUnitTypeModel $medicineUnitType): JsonResponse
    {
        $this->authorize('delete', $medicineUnitType);
        $this->unitTypeService->delete(id: $medicineUnitType->id);
        return $this->successResponse(data: $medicineUnitType, message: 'Satuan obat berhasil dihapus.');
    }
}
