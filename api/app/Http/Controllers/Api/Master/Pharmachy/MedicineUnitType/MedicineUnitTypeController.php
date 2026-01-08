<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineUnitType;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductUnitTypeRequest;
use App\Models\ProductUnitType;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineUnitTypeController extends Controller
{

    use ApiResponse;

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', ProductUnitType::class);
        $unitType = ProductUnitType::paginate(20);
        return response()->json($unitType);
    }


    /**
     * @throws AuthorizationException
     */
    public function store(ProductUnitTypeRequest $request): JsonResponse
    {
        $this->authorize('create', ProductUnitType::class);
        $unitType = ProductUnitType::create($request->validated());
        return $this->successResponse($unitType, 'Unit Type created successfully.', 201);
    }


    /**
     * @throws AuthorizationException
     */
    public function show(ProductUnitType $productUnitType): JsonResponse
    {
        $this->authorize('view', $productUnitType);
        return response()->json($productUnitType);
    }

    /**
     * @throws AuthorizationException
     */
    public function update(ProductUnitTypeRequest $request, ProductUnitType $productUnitType): JsonResponse
    {
        $this->authorize('update', $productUnitType);
        $productUnitType->update($request->validated());
        return $this->successResponse($productUnitType, 'Unit Type updated successfully.');
    }


    /**
     * @throws AuthorizationException
     */
    public function destroy(ProductUnitType $productUnitType): JsonResponse
    {
        $this->authorize('delete', $productUnitType);
        $productUnitType->delete();
        return $this->successResponse($productUnitType, 'Unit Type deleted successfully.');
    }
}
