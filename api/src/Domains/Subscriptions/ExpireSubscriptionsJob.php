<?php

declare(strict_types=1);

namespace Domains\Subscriptions;

use Domains\Subscriptions\Application\Services\SubscriptionService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

/**
 * Job: Expire subscription yang sudah melewati ends_at.
 *
 * Jalankan via scheduler (App\Console\Kernel):
 *   $schedule->job(new ExpireSubscriptionsJob)->daily();
 *
 * Atau manual:
 *   php artisan queue:work
 */
class ExpireSubscriptionsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(SubscriptionService $subscriptionService): void
    {
        $subscriptionService->expireStale();
    }
}
