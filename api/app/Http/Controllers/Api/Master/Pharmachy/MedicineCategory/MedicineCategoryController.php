<?php

namespace App\Http\Controllers\Api\Master\Pharmachy\MedicineCategory;

use App\Http\Controllers\Controller;
use App\Http\Requests\MedicineCategoryRequest;
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

    /**
     * @throws AuthorizationException
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', MedicineCategory::class);
        $productCategories = $this->medicineCategoryService->getProductCategories($request);
        return response()->json($productCategories);
    }


    /**
     * @throws AuthorizationException
     */
    public function store(MedicineCategoryRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineCategory::class);
        $medicineCategory = $this->medicineCategoryService->store($request);
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


    /**
     * @throws AuthorizationException
     */
    public function update(MedicineCategoryRequest $request, MedicineCategory $medicineCategory): JsonResponse
    {
        $this->authorize('update', $medicineCategory);
        $this->medicineCategoryService->update($request, $medicineCategory->id);
        return $this->successResponse($medicineCategory, 'Product Category successfully updated.');
    }


    /**
     * @throws AuthorizationException
     */
    public function destroy(MedicineCategory $medicineCategory): JsonResponse
    {
        $this->authorize('delete', $medicineCategory);
        $this->medicineCategoryService->destroy($medicineCategory->id);
        return $this->successResponse($medicineCategory, 'Product Category successfully deleted.');
    }
}
