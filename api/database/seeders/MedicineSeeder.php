<?php

namespace Database\Seeders;

use App\Models\Medicine;
use App\Models\MedicineBatch;
use App\Models\MedicineBatchStock;
use App\Models\Tenant;
use App\Models\MedicineWarehouse;
use App\Models\MedicineRack;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        $tenant = Tenant::query()->first();

        if (!$tenant) {
            $this->command->warn('No tenant found. Skipping MedicineSeeder.');
            return;
        }

        $warehouse = MedicineWarehouse::where('tenant_id', $tenant->id)->first();
        $rack = MedicineRack::where('tenant_id', $tenant->id)->first();

        if (!$warehouse || !$rack) {
            $this->command->warn('Warehouse or Rack not found. Skipping batch stock.');
        }

        Medicine::factory()
            ->count(10)
            ->create([
                'tenant_id' => $tenant->id,
            ])
            ->each(function ($medicine) use ($warehouse, $rack) {

                // Each medicine can have multiple batches
                $batches = MedicineBatch::factory()
                    ->count(rand(1, 3))
                    ->create([
                        'medicine_id' => $medicine->id,
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
