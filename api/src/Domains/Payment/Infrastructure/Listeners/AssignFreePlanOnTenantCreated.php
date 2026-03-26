<?php

declare(strict_types=1);

namespace Domains\Payment\Infrastructure\Listeners;

use App\Models\Plan;
use App\Models\Subscription;
use Domains\Tenant\Domain\Events\TenantCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

/**
 * Listen ke TenantCreated domain event dari Tenant domain.
 *
 * Tanggung jawab:
 *  - Cari Free Plan
 *  - Assign ke tenant yang baru dibuat
 *  - Supaya tenant tidak langsung kena block CheckTenantSubscription
 *
 * Implements ShouldQueue agar tidak memblok response HTTP,
 * tapi sync juga oke kalau queue belum dikonfigurasi.
 */
class AssignFreePlanOnTenantCreated implements ShouldQueue
{
    public function handle(TenantCreated $event): void
    {
        $tenantId = $event->getTenantId();

        if (!$tenantId) {
            Log::warning('[AssignFreePlanOnTenantCreated] tenant ID kosong, skip assign free plan.');
            return;
        }

        $freePlan = Plan::where('slug', 'free')->first();

        if (!$freePlan) {
            Log::warning('[AssignFreePlanOnTenantCreated] Free plan tidak ditemukan, skip.');
            return;
        }

        // Cek sudah ada subscription aktif (idempotent)
        $alreadyExists = Subscription::where('tenant_id', $tenantId)
            ->where('plan_id', $freePlan->id)
            ->exists();

        if ($alreadyExists) {
            return;
        }

        Subscription::create([
            'tenant_id'     => $tenantId,
            'plan_id'       => $freePlan->id,
            'status'        => 'active',
            'starts_at'     => now(),
            'ends_at'       => now()->addYears(99),
            'trial_ends_at' => null,
            'cancelled_at'  => null,
        ]);

        Log::info("[AssignFreePlanOnTenantCreated] Free plan assigned to tenant [{$tenantId}].");
    }

    public function failed(TenantCreated $event, \Throwable $exception): void
    {
        Log::error('[AssignFreePlanOnTenantCreated] Gagal assign free plan.', [
            'tenant_id' => $event->getTenantId(),
            'error'     => $exception->getMessage(),
        ]);
    }
}
