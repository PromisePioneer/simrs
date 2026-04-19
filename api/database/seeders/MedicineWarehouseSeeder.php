<?php

namespace Database\Seeders;

use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineRackModel;
use Domains\Pharmacy\Infrastructure\Persistence\Models\MedicineWarehouseModel;
use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
use Illuminate\Database\Seeder;

class MedicineWarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tenants = TenantModel::all();

        foreach ($tenants as $tenant) {

            // Buat 1 warehouse per tenant
            $warehouse = MedicineWarehouseModel::create([
                'tenant_id' => $tenant->id,
                'code' => fake()->unique()->randomNumber(3),
                'name' => 'Gudang Central',
                'type' => 'central',
            ]);

            // Buat 1 rack di warehouse ini
            MedicineRackModel::create([
                'tenant_id' => $tenant->id,
                'warehouse_id' => $warehouse->id,
                'code' => 'RACK-0',
                'name' => 'Rack 0',
            ]);

            // Tambah minimal 9 rack lagi (tidak terikat warehouse)
            for ($i = 1; $i <= 9; $i++) {
                MedicineRackModel::create([
                    'tenant_id' => $tenant->id,
                    'warehouse_id' => null,
                    'code' => 'RACK-' . $i,
                    'name' => 'Rack ' . $i,
                ]);
            }
        }
    }
}
