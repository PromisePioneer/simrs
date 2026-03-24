<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Pharmacy\Application\Services\MedicineWarehouseService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineWarehouseModel;
use Domains\Pharmacy\Presentation\Requests\MedicineWarehouseRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineWarehouseController extends Controller
{
    use ApiResponse;

    public function __construct(private readonly MedicineWarehouseService $warehouseService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', MedicineWarehouseModel::class);
        $data = $this->warehouseService->getWarehouses(request: $request);
        return response()->json($data);
    }

    public function store(MedicineWarehouseRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineWarehouseModel::class);
        $data = $this->warehouseService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Gudang berhasil disimpan.');
    }

    public function show(MedicineWarehouseModel $medicineWarehouse): JsonResponse
    {
        $this->authorize('view', $medicineWarehouse);
        $medicineWarehouse->load('racks');
        return response()->json($medicineWarehouse);
    }

    public function update(MedicineWarehouseRequest $request, MedicineWarehouseModel $medicineWarehouse): JsonResponse
    {
        $this->authorize('update', $medicineWarehouse);
        $data = $this->warehouseService->update(data: $request->validated(), warehouse: $medicineWarehouse);
        return $this->successResponse(data: $data, message: 'Gudang berhasil diperbarui.');
    }

    public function destroy(MedicineWarehouseModel $medicineWarehouse): JsonResponse
    {
        $this->authorize('delete', $medicineWarehouse);
        $this->warehouseService->destroy(warehouse: $medicineWarehouse);
        return $this->successResponse(data: $medicineWarehouse, message: 'Gudang berhasil dihapus.');
    }
}
