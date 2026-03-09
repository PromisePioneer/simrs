<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineWarehouse;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicineWarehouseRequest;
use App\Models\MedicineWarehouse;
use App\Services\Master\Pharmachy\Medicine\Service\MedicineWarehouseService;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
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

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', MedicineWarehouse::class);
        $warehouse = $this->medicineWarehouseService->getWarehouses($request);
        return response()->json($warehouse);
    }


    /**
     * @throws AuthorizationException
     */
    public function store(MedicineWarehouseRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineWarehouse::class);
        $medicineWarehouse = $this->medicineWarehouseService->store($request);
        return $this->successResponse($medicineWarehouse, 'Warehouse successfully created.');
    }

    /**
     * @throws AuthorizationException
     */
    public function show(MedicineWarehouse $medicineWarehouse): JsonResponse
    {
        $this->authorize('view', $medicineWarehouse);
        $medicineWarehouse->load('racks');
        return response()->json($medicineWarehouse);
    }

    /**
     * @throws AuthorizationException
     */
    public function update(MedicineWarehouseRequest $request, MedicineWarehouse $medicineWarehouse): JsonResponse
    {
        $this->authorize('update', $medicineWarehouse);
        $medicineWarehouse = $this->medicineWarehouseService->update($request, $medicineWarehouse);
        return $this->successResponse($medicineWarehouse, 'Warehouse successfully updated.');
    }


    /**
     * @throws AuthorizationException
     */
    public function destroy(MedicineWarehouse $medicineWarehouse): JsonResponse
    {
        $this->authorize('delete', $medicineWarehouse);
        $medicineWarehouse->delete();
        return $this->successResponse($medicineWarehouse, 'Warehouse successfully deleted.');
    }
}
