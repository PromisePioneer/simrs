<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineCategory;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductCategoryRequest;
use App\Models\MedicineCategory;
use App\Services\Master\Pharmachy\Medicine\Service\MedicineCategoryService;
use App\Traits\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineCategoryController extends Controller
{
    use ApiResponse;

    private MedicineCategoryService $medicineCategoryService;

    public function __construct()
    {
        $this->medicineCategoryService = new MedicineCategoryService();
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', MedicineCategory::class);
        $productCategories = $this->medicineCategoryService->getProductCategories($request);
        return response()->json($productCategories);
    }


    public function store(ProductCategoryRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineCategory::class);
        $data = $request->validated();
        $data['tenant_id'] = auth()->user()->tenant_id ?? session('active_tenant_id');
        $medicineCategory = $this->medicineCategoryService->store($data);
        return $this->successResponse($medicineCategory, 'Product Category successfully added.');
    }


    /**
     * @throws AuthorizationException
     */
    public function show(MedicineCategory $medicineCategory): JsonResponse
    {
        $this->authorize('view', $medicineCategory);
        return response()->json($medicineCategory);
    }


    public function update(ProductCategoryRequest $request, MedicineCategory $medicineCategory): JsonResponse
    {
        $this->authorize('update', $medicineCategory);
        $data = $request->validated();
        $this->medicineCategoryService->update($data, $medicineCategory->id);
        return $this->successResponse($medicineCategory, 'Product Category successfully updated.');
    }


    public function destroy(MedicineCategory $medicineCategory): JsonResponse
    {
        $this->authorize('delete', $medicineCategory);
        $this->medicineCategoryService->destroy($medicineCategory->id);
        return $this->successResponse($medicineCategory, 'Product Category successfully deleted.');
    }
}
