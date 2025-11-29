<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\ProductRack;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRackRequest;
use App\Models\ProductRack;
use App\Services\Master\Pharmachy\Product\Repository\ProductRackRepository;
use App\Services\Master\Pharmachy\Product\Service\ProductRackService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductRackController extends Controller
{
    use ApiResponse;


    private ProductRackService $productRackService;

    public function __construct()
    {
        $this->productRackService = new ProductRackService();
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', ProductRack::class);
        $productRacks = $this->productRackService->getProductRacks($request);
        return response()->json($productRacks);
    }


    public function store(ProductRackRequest $request): JsonResponse
    {
        $this->authorize('create', ProductRack::class);
        $productRack = $this->productRackService->store($request);
        return $this->successResponse($productRack, 'Product Rack created successfully.');
    }


    public function show(ProductRack $productRack): JsonResponse
    {
        $this->authorize('view', $productRack);
        return response()->json($productRack);
    }

    public function update(ProductRackRequest $request, ProductRack $productRack): JsonResponse
    {
        $this->authorize('update', $productRack);
        $productRack = $this->productRackService->update($productRack->id, $request);
        return $this->successResponse($productRack, 'Product Rack updated successfully.');
    }

    public function destroy(ProductRack $productRack): JsonResponse
    {
        $this->authorize('delete', $productRack);
        $productRack = $this->productRackService->destroy($productRack->id);
        return $this->successResponse($productRack, 'Product Rack deleted successfully.');
    }
}
