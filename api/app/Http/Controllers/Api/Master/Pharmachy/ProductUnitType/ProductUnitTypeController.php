<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\ProductUnitType;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductUnitTypeRequest;
use App\Models\ProductUnitType;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProductUnitTypeController extends Controller
{

    use ApiResponse;

    public function index(Request $request)
    {
        $this->authorize('view', ProductUnitType::class);
        $unitType = ProductUnitType::paginate(20);
        return response()->json($unitType);
    }


    public function store(ProductUnitTypeRequest $request)
    {
        $this->authorize('create', ProductUnitType::class);
        $unitType = ProductUnitType::create($request->validated());
        return $this->successResponse($unitType, 'Unit Type created successfully.', 201);
    }


    public function show(ProductUnitType $productUnitType)
    {
        $this->authorize('view', $productUnitType);
        return response()->json($productUnitType);
    }

    public function update(ProductUnitTypeRequest $request, ProductUnitType $productUnitType)
    {
        $this->authorize('update', $productUnitType);
        $productUnitType->update($request->validated());
        return $this->successResponse($productUnitType, 'Unit Type updated successfully.');
    }


    public function destroy(ProductUnitType $productUnitType)
    {
        $this->authorize('delete', $productUnitType);
        $productUnitType->delete();
        return $this->successResponse($productUnitType, 'Unit Type deleted successfully.');
    }
}
