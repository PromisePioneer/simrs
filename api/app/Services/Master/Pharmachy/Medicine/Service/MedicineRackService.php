<?php

namespace App\Services\Master\Pharmachy\Medicine\Service;

use App\Http\Requests\MedicineRackRequest;
use App\Models\MedicineWarehouse;
use App\Services\Master\Pharmachy\Medicine\Repository\MedicineRackRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class MedicineRackService
{
    private MedicineRackRepository $medicineRackRepository;

    public function __construct()
    {
        $this->medicineRackRepository = new MedicineRackRepository();
    }

    public function getMedicineRacks(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->medicineRackRepository->getMedicineRacks(filters: $filters, perPage: $perPage);
    }


    public function getUnassignedRacks(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only('search');
        $perPage = $request->input('per_page');
        return $this->medicineRackRepository->getUnassignedRacks(filters: $filters, perPage: $perPage);
    }


    public function store(MedicineRackRequest $request): ?object
    {
        $data = $request->validated();
        return $this->medicineRackRepository->store(data: $data);
    }

    public function update(MedicineRackRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->medicineRackRepository->update(id: $id, data: $data);
    }


    public function destroy(string $id): ?object
    {
        return $this->medicineRackRepository->destroy(id: $id);
    }

    public function getByWarehouse(MedicineWarehouse $medicineWarehouse): ?object
    {
        return $this->medicineRackRepository->getByWarehouseId(id: $medicineWarehouse->id);
    }
}
