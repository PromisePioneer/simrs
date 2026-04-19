<?php

namespace Database\Seeders;

use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineBatchStockModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineRackModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineWarehouseModel;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = TenantModel::all();

        foreach ($tenants as $tenant) {

            $warehouse = MedicineWarehouseModel::where('tenant_id', $tenant->id)->first();
            $rack = MedicineRackModel::where('tenant_id', $tenant->id)->first();

            if (!$warehouse || !$rack) {
                $this->command->warn("Warehouse or Rack not found for tenant {$tenant->id}. Skipping batch stock.");
            }

            // Buat medicines per tenant
            MedicineModel::factory()
                ->count(10)
                ->create([
                    'tenant_id' => $tenant->id,
                ])
                ->each(function ($medicine) use ($warehouse, $rack, $tenant) {

                    // Setiap medicine punya 1–3 batch
                    $batches = MedicineBatchModel::factory()
                        ->count(rand(1, 3))
                        ->create([
                            'medicine_id' => $medicine->id,
                            'tenant_id' => $tenant->id, // pastikan tenant_id di batch
                        ]);

                    foreach ($batches as $batch) {
                        if ($warehouse && $rack) {
                            MedicineBatchStockModel::create([
                                'batch_id' => $batch->id,
                                'warehouse_id' => $warehouse->id,
                                'rack_id' => $rack->id,
                                'stock_amount' => rand(50, 500),
                            ]);
                        }
                    }
                });
        }
    }
}
