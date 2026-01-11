<?php

namespace App\Services\Master\Pharmachy\Medicine\Service;

use App\Http\Requests\MedicineRackRequest;
use App\Services\Master\Pharmachy\Medicine\Repository\MedicineRackRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class MedicineRackService
{
    private MedicineRackRepository $productRackRepository;

    public function __construct()
    {
        $this->productRackRepository = new MedicineRackRepository();
    }

    public function getMedicineRacks(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->productRackRepository->getMedicineRacks(filters: $filters, perPage: $perPage);
    }


    public function getUnassignedRacks(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->productRackRepository->getUnassignedRacks(filters: $filters, perPage: $perPage);
    }


    public function store(MedicineRackRequest $request): ?object
    {
        $data = $request->validated();
        return $this->productRackRepository->store(data: $data);
    }

    public function update(MedicineRackRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->productRackRepository->update(id: $id, data: $data);
    }


    public function destroy(string $id): ?object
    {
        return $this->productRackRepository->destroy(id: $id);
    }
}
