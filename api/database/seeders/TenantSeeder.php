<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Plan;
use App\Models\PlanModule;
use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        for ($i = 0; $i < 3; $i++) {
            Tenant::create([
                'id' => Str::uuid()->toString(),
                'code' => now()->format('YmdHis') . "00" . $i++,
                'name' => fake()->company(),
                'type' => 'rs',
            ]);
        }
    }
}
