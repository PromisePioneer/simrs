<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineWarehouse;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicineWarehouseRequest;
use App\Models\MedicineWarehouse;
use App\Services\Master\Pharmachy\Medicine\Service\MedicineWarehouseService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineWarehouseController extends Controller
{
    use ApiResponse;

    protected MedicineWarehouseService $medicineWarehouseService;

    public function __construct()
    {
        $this->medicineWarehouseService = new MedicineWarehouseService();
    }

    public function index(Request $request): JsonResponse
    {
        $warehouse = $this->medicineWarehouseService->getWarehouses($request);
        return response()->json($productWarehouse);
    }


    public function store(MedicineWarehouseRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['tenant_id'] = auth()->user()->tenant_id ?? session('active_tenant_id');
        $productWarehouse = MedicineWarehouse::create($data);
        return $this->successResponse($productWarehouse, 'Warehouse successfully created.');
    }

    public function show(MedicineWarehouse $productWarehouse): JsonResponse
    {
        return response()->json($productWarehouse);
    }

    public function update(MedicineWarehouseRequest $request, MedicineWarehouse $productWarehouse): JsonResponse
    {
        $productWarehouse->update($request->validated());
        return $this->successResponse($productWarehouse, 'Warehouse successfully updated.');
    }


    public function destroy(MedicineWarehouse $productWarehouse): JsonResponse
    {
        $productWarehouse->delete();
        return $this->successResponse($productWarehouse, 'Warehouse successfully deleted.');
    }
}
