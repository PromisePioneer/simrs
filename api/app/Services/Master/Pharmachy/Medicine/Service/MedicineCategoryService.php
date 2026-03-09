<?php

namespace App\Services\Master\Pharmachy\Medicine\Service;

use App\Http\Requests\MedicineCategoryRequest;
use App\Models\MedicineCategory;
use App\Services\Master\Pharmachy\Medicine\Repository\MedicineCategoryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class MedicineCategoryService
{
    private MedicineCategoryRepository $medicineCategoryRepository;

    public function __construct()
    {
        $this->medicineCategoryRepository = new MedicineCategoryRepository();
    }


    public function getProductCategories(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->medicineCategoryRepository->getCategories($filters, $perPage);
    }


    public function store(MedicineCategoryRequest $request): ?object
    {
        $data = $request->validated();
        $data['tenant_id'] = auth()->user()->tenant_id ?? session('active_tenant_id');
        return $this->medicineCategoryRepository->store($data);
    }

    public function update(MedicineCategoryRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->medicineCategoryRepository->update($id, $data);
    }

    public function destroy(string $id): ?object
    {
        return $this->medicineCategoryRepository->destroy($id);
    }
}
