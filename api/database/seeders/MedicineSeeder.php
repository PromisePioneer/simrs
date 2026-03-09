<?php

namespace Database\Seeders;

use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\MedicineBatchStock;
use App\Models\Tenant;
use App\Models\MedicineWarehouse;
use App\Models\MedicineRack;
use Illuminate\Database\Seeder;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {

            $warehouse = MedicineWarehouse::where('tenant_id', $tenant->id)->first();
            $rack = MedicineRack::where('tenant_id', $tenant->id)->first();

            if (!$warehouse || !$rack) {
                $this->command->warn("Warehouse or Rack not found for tenant {$tenant->id}. Skipping batch stock.");
            }

            // Buat medicines per tenant
            Medicine::factory()
                ->count(10)
                ->create([
                    'tenant_id' => $tenant->id,
                ])
                ->each(function ($medicine) use ($warehouse, $rack, $tenant) {

                    // Setiap medicine punya 1–3 batch
                    $batches = MedicineBatch::factory()
                        ->count(rand(1, 3))
                        ->create([
                            'medicine_id' => $medicine->id,
                            'tenant_id' => $tenant->id, // pastikan tenant_id di batch
                        ]);

                    foreach ($batches as $batch) {
                        if ($warehouse && $rack) {
                            MedicineBatchStock::create([
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
