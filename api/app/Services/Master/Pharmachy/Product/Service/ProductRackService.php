<?php

namespace App\Services\Master\Pharmachy\Product\Service;

use App\Http\Requests\ProductRackRequest;
use App\Http\Requests\ProductRequest;
use App\Services\Master\Pharmachy\Product\Repository\ProductRackRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductRackService
{
    private ProductRackRepository $productRackRepository;

    public function __construct()
    {
        $this->productRackRepository = new ProductRackRepository();
    }

    public function getProductRacks(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->productRackRepository->getProductRacks($filters, $perPage);
    }


    public function store(ProductRackRequest $request): ?object
    {
        $data = $request->validated();
        return $this->productRackRepository->store($data);
    }

    public function update(ProductRackRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->productRackRepository->update($id, $data);
    }


    public function destroy(string $id): ?object
    {
        return $this->productRackRepository->destroy($id);
    }
}
