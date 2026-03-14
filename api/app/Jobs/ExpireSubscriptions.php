<?php

namespace App\Jobs;

use App\Models\Subscription;
use App\Services\Tenant\SubscriptionCacheHelper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ExpireSubscriptions implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(): void
    {
        $expired = Subscription::where('status', 'active')
            ->whereNotNull('ends_at')
            ->where('ends_at', '<', now())
            ->get();

        foreach ($expired as $subscription) {
            $subscription->update([
                'status' => 'expired',
                'cancelled_at' => now(),
            ]);

            SubscriptionCacheHelper::clearModuleAccess($subscription->tenant_id);

            Log::info("Subscription expired", [
                'tenant_id' => $subscription->tenant_id,
                'plan_id' => $subscription->plan_id,
                'ended_at' => $subscription->ends_at,
            ]);
        }

        Log::info("ExpireSubscriptions job selesai", [
            'total_expired' => $expired->count(),
        ]);
    }
}
