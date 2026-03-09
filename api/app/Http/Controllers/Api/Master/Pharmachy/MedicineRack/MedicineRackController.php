<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineRack;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicineRackRequest;
use App\Models\MedicineRack;
use App\Models\MedicineWarehouse;
use App\Services\Master\Pharmachy\Medicine\Service\MedicineRackService;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineRackController extends Controller
{
    use ApiResponse;

    private MedicineRackService $medicineRackService;

    public function __construct()
    {
        $this->medicineRackService = new MedicineRackService();
    }

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', MedicineRack::class);
        $racks = $this->medicineRackService->getMedicineRacks($request);
        return response()->json($racks);
    }


    public function getUnassignedRacks(Request $request): JsonResponse
    {
        $racks = $this->medicineRackService->getUnassignedRacks($request);
        return response()->json($racks);
    }


    /**
     * @throws AuthorizationException
     */
    public function store(MedicineRackRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineRack::class);
        $medicineRack = $this->medicineRackService->store($request);
        return $this->successResponse($medicineRack, 'Product Rack created successfully.');
    }


    /**
     * @throws AuthorizationException
     */
    public function show(MedicineRack $medicineRack): JsonResponse
    {
        $this->authorize('view', $medicineRack);
        return response()->json($medicineRack);
    }

    /**
     * @throws AuthorizationException
     */
    public function update(MedicineRackRequest $request, MedicineRack $medicineRack): JsonResponse
    {
        $this->authorize('update', $medicineRack);
        $medicineRack = $this->medicineRackService->update($medicineRack->id, $request);
        return $this->successResponse($medicineRack, 'Product Rack updated successfully.');
    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(MedicineRack $medicineRack): JsonResponse
    {
        $this->authorize('delete', $medicineRack);
        $medicineRack = $this->medicineRackService->destroy($medicineRack->id);
        return $this->successResponse($medicineRack, 'Product Rack deleted successfully.');
    }

    public function getByWarehouse(MedicineWarehouse $medicineWarehouse): JsonResponse
    {
        return response()->json($this->medicineRackService->getByWarehouse($medicineWarehouse));
    }
}
