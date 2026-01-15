<?php

namespace App\Services\Master\Pharmachy\Medicine\Service;

use App\Http\Requests\MedicineWarehouseRequest;
use App\Models\MedicineWarehouse;
use App\Services\Master\Pharmachy\Medicine\Repository\MedicineWarehouseRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedicineWarehouseService
{

    protected MedicineWarehouseRepository $medicineWarehouseRepository;

    public function __construct()
    {
        $this->medicineWarehouseRepository = new MedicineWarehouseRepository();
    }


    public function getWarehouses(Request $request): object
    {
        $filters = $request->only(['search']);
        $perPage = $request->input('per_page');
        return $this->medicineWarehouseRepository->getWarehouses($filters, $perPage);
    }


    public function store(MedicineWarehouseRequest $request): object
    {
        $data = $request->validated();
        $data['tenant_id'] = auth()->user()->tenant_id ?? session('active_tenant_id');
        return $this->medicineWarehouseRepository->store($data);
    }

    public function update(MedicineWarehouseRequest $request, $id)
    {
        $data = $request->validated();
        return $this->medicineWarehouseRepository->update($request, $id);
    }


    public function destroy(MedicineWarehouse $medicineWarehouse): object
    {
        return $this->medicineWarehouseRepository->destroy($medicineWarehouse->id);
    }

}
