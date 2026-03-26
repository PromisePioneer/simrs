<?php

namespace Database\Seeders;

use Domains\Tenant\Infrastructure\Persistence\Models\TenantModel;
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
            TenantModel::create([
                'id' => Str::uuid()->toString(),
                'code' => now()->format('YmdHis') . "00" . $i++,
                'name' => fake()->company(),
                'type' => 'rs',
            ]);
        }
    }
}
