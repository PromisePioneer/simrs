<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use Domains\Pharmacy\Domain\Repository\MedicineRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineUnitModel;
use App\Services\Tenant\TenantContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

readonly class MedicineService
{
    public function __construct(private MedicineRepositoryInterface $medicineRepository)
    {
    }

    public function getMedicines(Request $request): object
    {
        return $this->medicineRepository->getMedicines(
            filters: $request->only(['search', 'type']),
            perPage: (int)$request->input('per_page'),
        );
    }

    /** @throws Throwable */
    public function generateSKU(): array
    {
        return DB::transaction(function () {
            $last = $this->medicineRepository->findLastSequence();
            $next = $last ? $last->sequence + 1 : 1;

            return [
                'sequence' => $next,
                'sku' => 'MED-' . str_pad((string)$next, 6, '0', STR_PAD_LEFT),
                'code' => 'MED-' . date('Y') . '-' . str_pad((string)$next, 4, '0', STR_PAD_LEFT),
            ];
        });
    }


    public function searchWithStock(string $search = '', int $limit = 20): array
    {
        return $this->medicineRepository->searchWithStock($search, $limit);
    }


    /** @throws Throwable */
    public function store(array $data): ?object
    {
        return DB::transaction(function () use ($data) {
            $sku = $this->generateSKU();

            $medicine = MedicineModel::create([
                'tenant_id' => TenantContext::getId(),
                'sku' => $sku['sku'],
                'sequence' => $sku['sequence'],
                'name' => $data['name'],
                'base_unit' => $data['base_unit'],
                'type' => $data['type'],
                'is_for_sell' => $data['is_for_sell'] ?? true,
                'must_has_receipt' => $data['must_has_receipt'] ?? false,
                'category_id' => $data['category_id'],
                'reference_purchase_price' => $data['reference_purchase_price'] ?? null,
            ]);

            $units = json_decode($data['units'] ?? '[]');
            foreach ($units as $unit) {
                MedicineUnitModel::create([
                    'medicine_id' => $medicine->id,
                    'unit_name' => $unit->unit_name,
                    'multiplier' => $unit->multiplier,
                ]);
            }

            return $medicine;
        });
    }

    /** @throws Throwable */
    public function update(array $data, MedicineModel $medicine): ?object
    {
        return DB::transaction(function () use ($data, $medicine) {
            $medicine->update([
                'name' => $data['name'],
                'base_unit' => $data['base_unit'],
                'type' => $data['type'],
                'is_for_sell' => $data['is_for_sell'] ?? true,
                'must_has_receipt' => $data['must_has_receipt'] ?? false,
                'category_id' => $data['category_id'],
                'reference_purchase_price' => $data['reference_purchase_price'] ?? null,
            ]);

            MedicineUnitModel::where('medicine_id', $medicine->id)->delete();
            $units = json_decode($data['units'] ?? '[]');
            foreach ($units as $unit) {
                MedicineUnitModel::create([
                    'medicine_id' => $medicine->id,
                    'unit_name' => $unit->unit_name,
                    'multiplier' => $unit->multiplier,
                ]);
            }

            return $medicine->fresh();
        });
    }

    public function destroy(MedicineModel $medicine): ?object
    {
        return $this->medicineRepository->destroy(id: $medicine->id);
    }

    public function getReadyStockMedicine(?string $search = null): object
    {
        return $this->medicineRepository->getReadyStocksMedicine($search);
    }
}
