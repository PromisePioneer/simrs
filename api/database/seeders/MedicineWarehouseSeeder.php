<?php

namespace Database\Seeders;

use App\Models\MedicineRack;
use App\Models\MedicineWarehouse;
use App\Models\Tenant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MedicineWarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            'tenant_id' => Tenant::query()->inRandomOrder()->first()->id,
            'code' => fake()->randomDigit(),
            'name' => 'Gudang 1',
            'type' => 'central',
        ];
        $warehouse = MedicineWarehouse::create($data);
        MedicineRack::create([
            'tenant_id' => $warehouse->tenant_id,
            'warehouse_id' => $warehouse->id,
            'code' => 'test',
            'name' => 'test',
        ]);


        for ($i = 0; $i < 10; $i++) {

            MedicineRack::create([
                'tenant_id' => $warehouse->tenant_id,
                'warehouse_id' => null,
                'code' => $i,
                'name' => $i,
            ]);
        }


    }
}
