<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\Medicine;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicineRequest;
use App\Models\Medicine;
use App\Services\Master\Pharmachy\Medicine\Service\MedicineService;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    use ApiResponse;

    private MedicineService $medicineService;

    public function __construct()
    {
        $this->medicineService = new MedicineService();
    }

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize(ability: 'view', arguments: Medicine::class);
        $medicine = $this->medicineService->getMedicines(request: $request);
        return response()->json($medicine);
    }


    /**
     * @throws AuthorizationException
     */
    public function store(MedicineRequest $request): JsonResponse
    {
        $this->authorize(ability: 'create', arguments: Medicine::class);
        $product = $this->medicineService->store($request);
        return $this->successResponse(data: $product, message: 'Product created successfully.');
    }

    /**
     * @throws AuthorizationException
     */
    public function show(Medicine $medicine): JsonResponse
    {
        $this->authorize(ability: 'view', arguments: $medicine);
        $medicine->load('category', 'batches');
        return response()->json($medicine);

    }

    /**
     * @throws AuthorizationException
     */
    public function update(MedicineRequest $request, Medicine $medicine): JsonResponse
    {
        $this->authorize('update', $medicine);
        $this->medicineService->update(request: $request, medicine: $medicine);
        return $this->successResponse(data: $medicine, message: 'Product updated successfully.');
    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(Medicine $medicine): JsonResponse
    {
        $this->authorize('delete', $medicine);
        $this->medicineService->destroy(medicine: $medicine);
        return $this->successResponse($medicine, 'Product deleted successfully.');
    }
}
