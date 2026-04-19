<?php

namespace Database\Seeders;

use Domains\Subscriptions\Infrastructure\Persistence\Models\PlanModel;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Free',
                'slug' => 'free',
                'description' => 'Paket gratis untuk mencoba fitur dasar',
                'price' => 0,
                'billing_period' => 'monthly',
                'max_users' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'description' => 'Paket untuk klinik kecil dengan kebutuhan rawat jalan dan rawat inap',
                'price' => 99000,
                'billing_period' => 'monthly',
                'max_users' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Paket lengkap dengan farmasi, EMR, dan akuntansi',
                'price' => 199000,
                'billing_period' => 'monthly',
                'max_users' => null, // unlimited
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            PlanModel::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
