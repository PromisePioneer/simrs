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


    public function store(MedicineWarehouseRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $warehouse = $this->medicineWarehouseRepository->store($data);
            if (!empty($data['racks'])) {
                $warehouse->racks()->createMany($data['racks']);
            }
            return $data;
        });
    }

}
