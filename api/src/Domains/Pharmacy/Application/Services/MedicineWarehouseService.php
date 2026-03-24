<?php

declare(strict_types=1);

namespace Domains\Pharmacy\Application\Services;

use App\Services\Tenant\TenantContext;
use Domains\Pharmacy\Domain\Repository\MedicineWarehouseRepositoryInterface;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineWarehouseModel;
use Illuminate\Http\Request;

readonly class MedicineWarehouseService
{
    public function __construct(private MedicineWarehouseRepositoryInterface $warehouseRepository) {}

    public function getWarehouses(Request $request): object
    {
        return $this->warehouseRepository->getWarehouses(
            filters: $request->only(['search']),
            perPage:(int) $request->input('per_page'),
        );
    }

    public function store(array $data): object
    {
        $data['tenant_id'] = TenantContext::getId();
        return $this->warehouseRepository->store($data);
    }

    public function update(array $data, MedicineWarehouseModel $warehouse): object
    {
        return $this->warehouseRepository->update($warehouse->id, $data);
    }

    public function destroy(MedicineWarehouseModel $warehouse): object
    {
        return $this->warehouseRepository->destroy($warehouse->id);
    }
}
