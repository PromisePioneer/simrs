<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TenantSubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        // Seeder pakai Basic plan — cukup untuk dev/testing
        $plan = Plan::where('slug', 'basic')->first();

        if (!$plan) {
            $this->command->error("Plan 'basic' tidak ditemukan. Jalankan PlanSeeder terlebih dahulu.");
            return;
        }

        foreach (Tenant::all() as $tenant) {
            Subscription::updateOrCreate(
                ['tenant_id' => $tenant->id],
                [
                    'plan_id'        => $plan->id,
                    'status'         => 'active',
                    'starts_at'      => Carbon::now(),
                    'ends_at'        => Carbon::now()->addYears(10), // ✅ bukan expires_at
                    'trial_ends_at'  => null,
                    'cancelled_at'   => null,
                ]
            );

            $this->command->info("Subscription assigned ke tenant: {$tenant->name}");
        }
    }
}
