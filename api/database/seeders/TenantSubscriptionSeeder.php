<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TenantSubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $basicPlan = Plan::where('slug', 'basic')->first();

        foreach (Tenant::all() as $tenant) {

            Subscription::updateOrCreate(
                ['tenant_id' => $tenant->id],
                [
                    'plan_id' => $basicPlan->id,
                    'status' => 'active',
                    'starts_at' => Carbon::now(),
                    'ends_at' => Carbon::now()->addYears(10), // biar panjang
                    'trial_ends_at' => null,
                ]
            );
        }
    }
}
