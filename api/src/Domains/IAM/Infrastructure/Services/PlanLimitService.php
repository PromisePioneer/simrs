<?php

declare(strict_types=1);

namespace Domains\IAM\Infrastructure\Services;

use App\Models\Tenant;
use App\Models\User;
use Domains\IAM\Domain\Exceptions\UserLimitExceededException;

/**
 * Infrastructure Service: Cek batas user dari plan tenant.
 *
 * Diletakkan di Infrastructure karena bergantung pada
 * App\Models\Tenant dan App\Models\User (Eloquent).
 * Domain tidak tahu tentang ini.
 */
final class PlanLimitService
{
    public function assertUserLimitNotReached(string $tenantId): void
    {
        $tenant = Tenant::find($tenantId);

        if (!$tenant) {
            return;
        }

        $plan = $tenant->getCurrentPlan();

        if (!$plan || is_null($plan->max_users)) {
            return; // unlimited
        }

        $currentCount = User::where('tenant_id', $tenantId)->count();

        if ($currentCount >= $plan->max_users) {
            throw UserLimitExceededException::forPlan($plan->name, $plan->max_users);
        }
    }
}
