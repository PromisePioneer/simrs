<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'id' => uuid_create(),
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'Paket basic untuk klinik kecil',
                'price' => 99000,
                'billing_period' => 'monthly',
                'max_users' => 5,
            ],
            [
                'id' => uuid_create(),
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Paket lengkap tanpa batasan',
                'price' => 199000,
                'billing_period' => 'monthly',
                'max_users' => null,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
