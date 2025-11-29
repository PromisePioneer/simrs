<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\ProductCategory;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductCategoryRequest;
use App\Models\ProductCategory;
use App\Services\Master\Pharmachy\Product\Service\ProductCategoryService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    use ApiResponse;

    private ProductCategoryService $productCategoryService;

    public function __construct()
    {
        $this->productCategoryService = new ProductCategoryService();
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', ProductCategory::class);
        $productCategories = $this->productCategoryService->getProductCategories($request);
        return response()->json($productCategories);
    }


    public function store(ProductCategoryRequest $request): JsonResponse
    {
        $this->authorize('create', ProductCategory::class);
        $data = $request->validated();
        $data['tenant_id'] = auth()->user()->tenant_id ?? session('active_tenant_id');
        $productCategory = $this->productCategoryService->store($data);
        return $this->successResponse($productCategory, 'Product Category successfully added.');
    }


    public function show(ProductCategory $productCategory): JsonResponse
    {
        $this->authorize('view', $productCategory);
        return response()->json($productCategory);
    }


    public function update(ProductCategoryRequest $request, ProductCategory $productCategory): JsonResponse
    {
        $this->authorize('update', $productCategory);
        $data = $request->validated();
        $this->productCategoryService->update($data, $productCategory->id);
        return $this->successResponse($productCategory, 'Product Category successfully updated.');
    }


    public function destroy(ProductCategory $productCategory): JsonResponse
    {
        $this->authorize('delete', $productCategory);
        $this->productCategoryService->destroy($productCategory->id);
        return $this->successResponse($productCategory, 'Product Category successfully deleted.');
    }
}
