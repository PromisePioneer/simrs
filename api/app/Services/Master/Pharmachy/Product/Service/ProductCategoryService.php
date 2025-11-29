<?php

namespace App\Services\Master\Pharmachy\Product\Service;

use App\Http\Requests\ProductCategoryRequest;
use App\Services\Master\Pharmachy\Product\Repository\ProductCategoryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductCategoryService
{
    private ProductCategoryRepository $productCategoryRepository;

    public function __construct()
    {
        $this->productCategoryRepository = new ProductCategoryRepository();
    }


    public function getProductCategories(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->productCategoryRepository->getCategories($filters, $perPage);
    }


    public function store(ProductCategoryRequest $request): ?object
    {
        $data = $request->validated();
        return $this->productCategoryRepository->store($data);
    }

    public function update(ProductCategoryRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->productCategoryRepository->update($id, $data);
    }

    public function destroy(string $id): ?object
    {
        return $this->productCategoryRepository->destroy($id);
    }
}
