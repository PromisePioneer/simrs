<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Domains\Subscriptions\Infrastructure\Persistence\Models\PlanModel;
use Domains\Subscriptions\Infrastructure\Persistence\Models\SubscriptionModel;
use Illuminate\Database\Seeder;

class TenantSubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        // Seeder pakai Basic plan — cukup untuk dev/testing
        $plan = PlanModel::where('slug', 'basic')->first();

        if (!$plan) {
            $this->command->error("Plan 'basic' tidak ditemukan. Jalankan PlanSeeder terlebih dahulu.");
            return;
        }

        foreach (Tenant::all() as $tenant) {
            SubscriptionModel::updateOrCreate(
                ['tenant_id' => $tenant->id],
                [
                    'plan_id' => $plan->id,
                    'status' => 'active',
                    'starts_at' => Carbon::now(),
                    'ends_at' => Carbon::now()->addYears(10), // ✅ bukan expires_at
                    'trial_ends_at' => null,
                    'cancelled_at' => null,
                ]
            );

            $this->command->info("Subscription assigned ke tenant: {$tenant->name}");
        }
    }
}
