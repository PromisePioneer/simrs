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
        return response()->json($warehouse);
    }


    public function store(MedicineWarehouseRequest $request): JsonResponse
    {
        $medicineWarehouse = $this->medicineWarehouseService->store($request);
        return $this->successResponse($medicineWarehouse, 'Warehouse successfully created.');
    }

    public function show(MedicineWarehouse $medicineWarehouse): JsonResponse
    {
        $medicineWarehouse->load('racks');
        return response()->json($medicineWarehouse);
    }

    public function update(MedicineWarehouseRequest $request, MedicineWarehouse $medicineWarehouse): JsonResponse
    {
        $medicineWarehouse = $this->medicineWarehouseService->update($request, $medicineWarehouse);
        return $this->successResponse($medicineWarehouse, 'Warehouse successfully updated.');
    }


    public function destroy(MedicineWarehouse $medicineWarehouse): JsonResponse
    {
        $medicineWarehouse->delete();
        return $this->successResponse($medicineWarehouse, 'Warehouse successfully deleted.');
    }
}
