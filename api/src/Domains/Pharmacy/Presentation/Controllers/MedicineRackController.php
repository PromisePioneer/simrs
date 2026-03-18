<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Pharmacy\Application\Services\MedicineRackService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineRackModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineWarehouseModel;
use Domains\Pharmacy\Presentation\Requests\MedicineRackRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineRackController extends Controller
{
    use ApiResponse;

    public function __construct(private MedicineRackService $rackService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', MedicineRackModel::class);
        $data = $this->rackService->getMedicineRacks(request: $request);
        return response()->json($data);
    }

    public function store(MedicineRackRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineRackModel::class);
        $data = $this->rackService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Rak berhasil disimpan.');
    }

    public function show(MedicineRackModel $medicineRack): JsonResponse
    {
        $this->authorize('view', $medicineRack);
        $medicineRack->load('warehouse');
        return response()->json($medicineRack);
    }

    public function update(MedicineRackRequest $request, MedicineRackModel $medicineRack): JsonResponse
    {
        $this->authorize('update', $medicineRack);
        $data = $this->rackService->update(data: $request->validated(), id: $medicineRack->id);
        return $this->successResponse(data: $data, message: 'Rak berhasil diperbarui.');
    }

    public function destroy(MedicineRackModel $medicineRack): JsonResponse
    {
        $this->authorize('delete', $medicineRack);
        $this->rackService->destroy(id: $medicineRack->id);
        return $this->successResponse(data: $medicineRack, message: 'Rak berhasil dihapus.');
    }

    public function getUnassignedRacks(Request $request): JsonResponse
    {
        $data = $this->rackService->getUnassignedRacks(request: $request);
        return response()->json($data);
    }

    public function getByWarehouse(MedicineWarehouseModel $medicineWarehouse): JsonResponse
    {
        $data = $this->rackService->getByWarehouse(warehouse: $medicineWarehouse);
        return response()->json($data);
    }
}
