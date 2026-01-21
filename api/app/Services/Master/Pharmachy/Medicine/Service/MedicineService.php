<?php

namespace App\Services\Master\Pharmachy\Medicine\Service;

use App\Http\Requests\MedicineRequest;
use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\MedicineUnit;
use App\Services\Master\Pharmachy\Medicine\Repository\MedicineRepository;
use App\Services\Tenant\TenantContext;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class MedicineService
{
    private MedicineRepository $medicineRepository;

    public function __construct()
    {
        $this->medicineRepository = new MedicineRepository();
    }


    public function getMedicines(Request $request): Collection|LengthAwarePaginator
    {
        $filters = $request->only(['search', 'type']);
        $perPage = $request->input('per_page');
        return $this->medicineRepository->getMedicines($filters, $perPage);
    }


    public function store(MedicineRequest $request): ?object
    {

        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            $medicine = Medicine::create([
                'id' => Str::uuid()->toString(),
                'tenant_id' => TenantContext::getId(),
                'sku' => $data['sku'],
                'code' => $data['code'],
                'name' => $data['name'],
                'base_unit' => $data['base_unit'],
                'type' => $data['type'],
                'is_for_sell' => $data['is_for_sell'] ?? true,
                'must_has_receipt' => $data['must_has_receipt'] ?? false,
                'category_id' => $data['category_id'],
                'reference_purchase_price' => $data['reference_purchase_price'] ?? null,
            ]);



            $units = json_decode($data['units']);

            dd($units);
            // 2️⃣ Create Medicine Units
            foreach ($units as $unit) {
                MedicineUnit::create([
                    'medicine_id' => $medicine->id,
                    'unit_name' => $unit['unit_name'],
                    'multiplier' => $unit['multiplier'],
                ]);
            }


            if (!empty($data['stock_amount']) && $data['stock_amount'] > 0) {
                MedicineBatch::create([
                    'tenant_id' => TenantContext::getId(),
                    'medicine_id' => $medicine->id,
                    'warehouse_id' => $data['warehouse_id'],
                    'rack_id' => $data['rack_id'] ?? null,
                    'batch_number' => $data['batch_number'] ?? $this->autoBatch(),
                    'expired_date' => $data['expired_date'],
                    'stock_base_unit' => $data['stock_amount'],
                ]);
            }


            return $medicine->load('batches');
        });
    }


    public function autoBatch()
    {
        return 'INT-' . now()->format('ymd-His');
    }


    public function update(MedicineRequest $request, string $id): ?object
    {
        $data = $request->validated();
        return $this->medicineRepository->update($id, $data);
    }

    public function destroy(string $id): ?object
    {
        return $this->medicineRepository->destroy($id);
    }

}
