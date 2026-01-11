<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineRack;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicineRackRequest;
use App\Models\MedicineRack;
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
        $productRack = $this->medicineRackService->store($request);
        return $this->successResponse($productRack, 'Product Rack created successfully.');
    }


    /**
     * @throws AuthorizationException
     */
    public function show(MedicineRack $productRack): JsonResponse
    {
        $this->authorize('view', $productRack);
        return response()->json($productRack);
    }

    /**
     * @throws AuthorizationException
     */
    public function update(MedicineRackRequest $request, MedicineRack $productRack): JsonResponse
    {
        $this->authorize('update', $productRack);
        $productRack = $this->medicineRackService->update($productRack->id, $request);
        return $this->successResponse($productRack, 'Product Rack updated successfully.');
    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(MedicineRack $productRack): JsonResponse
    {
        $this->authorize('delete', $productRack);
        $productRack = $this->medicineRackService->destroy($productRack->id);
        return $this->successResponse($productRack, 'Product Rack deleted successfully.');
    }
}
