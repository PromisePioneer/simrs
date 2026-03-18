<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Presentation\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Domains\Pharmacy\Application\Services\MedicineCategoryService;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineCategoryModel;
use Domains\Pharmacy\Presentation\Requests\MedicineCategoryRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicineCategoryController extends Controller
{
    use ApiResponse;

    public function __construct(private MedicineCategoryService $categoryService) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('view', MedicineCategoryModel::class);
        $data = $this->categoryService->getCategories(request: $request);
        return response()->json($data);
    }

    public function store(MedicineCategoryRequest $request): JsonResponse
    {
        $this->authorize('create', MedicineCategoryModel::class);
        $data = $this->categoryService->store(data: $request->validated());
        return $this->successResponse(data: $data, message: 'Kategori berhasil disimpan.');
    }

    public function show(MedicineCategoryModel $medicineCategory): JsonResponse
    {
        $this->authorize('view', $medicineCategory);
        return response()->json($medicineCategory);
    }

    public function update(MedicineCategoryRequest $request, MedicineCategoryModel $medicineCategory): JsonResponse
    {
        $this->authorize('update', $medicineCategory);
        $data = $this->categoryService->update(data: $request->validated(), id: $medicineCategory->id);
        return $this->successResponse(data: $data, message: 'Kategori berhasil diperbarui.');
    }

    public function destroy(MedicineCategoryModel $medicineCategory): JsonResponse
    {
        $this->authorize('delete', $medicineCategory);
        $this->categoryService->destroy(id: $medicineCategory->id);
        return $this->successResponse(data: $medicineCategory, message: 'Kategori berhasil dihapus.');
    }
}
