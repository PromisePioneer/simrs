<?php

namespace App\Actions\Tenant;

use App\Http\Requests\TenantRequest;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;

class CreateTenant
{
    public function execute(TenantRequest $request): Tenant
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            $data['code'] = now()->format('YmdHis');

            $tenant = Tenant::create($data);
            $freePlan = Plan::where('slug', 'free')->first();

            if ($freePlan) {
                Subscription::create([
                    'tenant_id' => $tenant->id,
                    'plan_id' => $freePlan->id,
                    'status' => 'active',
                    'starts_at' => now(),
                    'ends_at' => now()->addYears(99),
                    'trial_ends_at' => null,
                    'cancelled_at' => null,
                ]);
            }

            return $tenant;
        });
    }
}
