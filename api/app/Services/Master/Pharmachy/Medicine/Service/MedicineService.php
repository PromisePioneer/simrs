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
use Throwable;

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


    /**
     * @throws Throwable
     */
    public function store(MedicineRequest $request): ?object
    {

        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $medicine = Medicine::create([
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

            foreach ($units as $unit) {
                MedicineUnit::create([
                    'medicine_id' => $medicine->id,
                    'unit_name' => $unit->unit_name,
                    'multiplier' => $unit->multiplier,
                ]);
            }
        });
    }


    public function autoBatch(): string
    {
        return 'INT-' . now()->format('ymd-His');
    }


    /**
     * @throws Throwable
     */
    public function update(MedicineRequest $request, Medicine $medicine): ?object
    {
        return DB::transaction(function () use ($request, $medicine) {
            $data = $request->validated();
            $medicine->update([
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

            MedicineUnit::where('medicine_id', $medicine->id)->delete();
            foreach ($units as $unit) {
                MedicineUnit::create([
                    'medicine_id' => $medicine->id,
                    'unit_name' => $unit->unit_name,
                    'multiplier' => $unit->multiplier,
                ]);
            }
        });
    }

    public function destroy(Medicine $medicine): ?object
    {
        return $this->medicineRepository->destroy(id: $medicine->id);
    }

}
