<?php

namespace Database\Seeders;

use App\Models\MedicineRack;
use App\Models\MedicineWarehouse;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class MedicineWarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {

            // Buat 1 warehouse per tenant
            $warehouse = MedicineWarehouse::create([
                'tenant_id' => $tenant->id,
                'code' => fake()->unique()->randomNumber(3),
                'name' => 'Gudang Central',
                'type' => 'central',
            ]);

            // Buat 1 rack di warehouse ini
            MedicineRack::create([
                'tenant_id' => $tenant->id,
                'warehouse_id' => $warehouse->id,
                'code' => 'RACK-0',
                'name' => 'Rack 0',
            ]);

            // Tambah minimal 9 rack lagi (tidak terikat warehouse)
            for ($i = 1; $i <= 9; $i++) {
                MedicineRack::create([
                    'tenant_id' => $tenant->id,
                    'warehouse_id' => null,
                    'code' => 'RACK-' . $i,
                    'name' => 'Rack ' . $i,
                ]);
            }
        }
    }
}
