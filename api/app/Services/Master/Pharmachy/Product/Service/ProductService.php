<?php

namespace App\Services\Master\Pharmachy\Product\Service;

use App\Http\Requests\ProductRequest;
use App\Services\Master\Pharmachy\Product\Repository\ProductRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService
{
    private ProductRepository $productRepository;

    public function __construct()
    {
        $this->productRepository = new ProductRepository();
    }


    public function getProducts(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search', 'type']);
        $perPage = $request->input('per_page');
        return $this->productRepository->getProducts($filters, $perPage);
    }


    public function store(ProductRequest $request): ?object
    {
        $data = $request->validated();
        return $this->productRepository->store($data);
    }


    public function update(ProductRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->productRepository->update($id, $data);
    }

    public function destroy(string $id): ?object
    {
        return $this->productRepository->destroy($id);
    }

}
