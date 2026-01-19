<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\Medicine;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductRequest;
use App\Models\Medicine;
use App\Services\Master\Pharmachy\Medicine\Service\MedicineService;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    use ApiResponse;

    private MedicineService $productService;

    public function __construct()
    {
        $this->productService = new MedicineService();
    }

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', Medicine::class);
        $products = $this->productService->getMedicines($request);
        return response()->json($products);
    }


    /**
     * @throws AuthorizationException
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $this->authorize('create', Medicine::class);
        $product = $this->productService->store($request);
        return $this->successResponse($product, 'Product created successfully.');
    }

    /**
     * @throws AuthorizationException
     */
    public function show(Medicine $product): JsonResponse
    {
        $this->authorize('view', $product);
        $product->load('warehouse', 'category', 'rack');
        return response()->json($product);

    }

    /**
     * @throws AuthorizationException
     */
    public function update(ProductRequest $request, Medicine $medicine): JsonResponse
    {
        $this->authorize('update', $medicine);
        $this->productService->update($request, $medicine->id);
        return $this->successResponse($medicine, 'Product updated successfully.');
    }

    /**
     * @throws AuthorizationException
     */
    public function destroy(Medicine $medicine): JsonResponse
    {
        $this->authorize('delete', $medicine);
        $this->productService->destroy($medicine->id);
        return $this->successResponse($medicine, 'Product deleted successfully.');
    }
}
